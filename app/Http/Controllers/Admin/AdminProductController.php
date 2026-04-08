<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminProductController extends Controller {

    public function index(Request $request) {
        $query = Product::with('images', 'inventory', 'category')
                        ->orderBy('sort_order');

        // FIX: support search query from the toolbar
        if ($request->filled('search')) {
            $q = '%' . $request->search . '%';
            $query->where(function ($b) use ($q) {
                $b->where('name',     'like', $q)
                  ->orWhere('subtitle', 'like', $q);
            });
        }

        return Inertia::render('Admin/AdminProducts', [
            'products'   => $query->paginate(15)->withQueryString(),
            'categories' => Category::where('is_active', 1)->get(),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name'        => 'required|string|max:200',
            'subtitle'    => 'nullable|string|max:200',
            'price'       => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'quantity'    => 'required|integer|min:0',
            'active'      => 'boolean',
            'sort_order'  => 'integer',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $category = Category::findOrFail($validated['category_id']);

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name'        => $validated['name'],
            'subtitle'    => $validated['subtitle'] ?? null,
            'price'       => $validated['price'],
            'category'    => $category->name,
            'active'      => $validated['active'] ?? true,
            'sort_order'  => $validated['sort_order'] ?? 0,
        ]);

        // Inventory
        Inventory::create([
            'product_id' => $product->id,
            'quantity'   => $validated['quantity'],
        ]);

        // Image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                // Use asset() so the stored URL is always absolute (http://127.0.0.1:8000/storage/...)
                'image_url'  => asset(Storage::url($path)),
                'is_primary' => true,
            ]);
        }

        return back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, $id) {
        $product = Product::with('inventory', 'images')->findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:200',
            'subtitle'    => 'nullable|string|max:200',
            'price'       => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'quantity'    => 'required|integer|min:0',
            'active'      => 'boolean',
            'sort_order'  => 'integer',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $category = Category::findOrFail($validated['category_id']);

        $product->update([
            'category_id' => $validated['category_id'],
            'name'        => $validated['name'],
            'subtitle'    => $validated['subtitle'] ?? null,
            'price'       => $validated['price'],
            'category'    => $category->name,
            'active'      => $validated['active'] ?? $product->active,
            'sort_order'  => $validated['sort_order'] ?? $product->sort_order,
        ]);

        // Update inventory
        if ($product->inventory) {
            $product->inventory->update(['quantity' => $validated['quantity']]);
        } else {
            Inventory::create(['product_id' => $product->id, 'quantity' => $validated['quantity']]);
        }

        // Replace image only if a new one was uploaded
        if ($request->hasFile('image')) {
            foreach ($product->images as $img) {
                $relativePath = ltrim(str_replace('/storage', '', $img->image_url), '/');
                Storage::disk('public')->delete($relativePath);
                $img->delete();
            }

            $path = $request->file('image')->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                'image_url'  => asset(Storage::url($path)),
                'is_primary' => true,
            ]);
        }

        return back()->with('success', 'Product updated successfully.');
    }

    public function destroy($id) {
        $product = Product::with('images')->findOrFail($id);

        foreach ($product->images as $img) {
            $relativePath = ltrim(str_replace('/storage', '', $img->image_url), '/');
            Storage::disk('public')->delete($relativePath);
        }

        $product->delete(); // cascade deletes images, inventory, cart items

        return back()->with('success', 'Product deleted.');
    }
}
