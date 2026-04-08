<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // ── GET / ─────────────────────────────────────────────────
    public function landing()
    {
        return Inertia::render('LandingPage', [
            'featured'   => Product::with(['images', 'inventory'])
                                ->where('active', 1)
                                ->orderBy('sort_order')
                                ->take(3)
                                ->get(),
            'categories' => Category::where('is_active', 1)
                                ->get()
                                ->map(fn($c) => [
                                    'id'             => $c->id,
                                    'name'           => $c->name,
                                    'image_url'      => $c->image_url,
                                    'products_count' => Product::where('category_id', $c->id)
                                                            ->where('active', 1)
                                                            ->join('inventories', 'products.id', '=', 'inventories.product_id')
                                                            ->sum('inventories.quantity'),
                                ]),
        ]);
    }

    // ── GET /shop ─────────────────────────────────────────────
    public function index(Request $request)
    {
        $query = Product::with(['images', 'inventory'])
                        ->where('active', 1);

        // Search
        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('name',     'like', "%{$request->q}%")
                  ->orWhere('subtitle', 'like', "%{$request->q}%");
            });
        }

        // Category filter
        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        // Sort
        match ($request->sort) {
            'low-high' => $query->orderBy('price', 'asc'),
            'high-low' => $query->orderBy('price', 'desc'),
            'newest'   => $query->orderBy('created_at', 'desc'),
            default    => $query->orderBy('sort_order', 'asc'),
        };

        return Inertia::render('ProductListingPage', [
            'products'   => $query->paginate(6)->withQueryString(),
            'categories' => Category::where('is_active', 1)->pluck('name'),
            'filters'    => $request->only(['q', 'category', 'sort']),
        ]);
    }

    // ── GET /product/{id} ─────────────────────────────────────
    public function show($id)
    {
        $product = Product::with(['images', 'inventory', 'category'])
                        ->findOrFail($id);

        $related = Product::with(['images', 'inventory'])
            ->where('category', $product->category)
            ->where('id', '!=', $id)
            ->where('active', 1)
            ->take(4)
            ->get();

        return Inertia::render('ProductDetailsPage', [
            'product' => $product,
            'related' => $related,
        ]);
    }
}
