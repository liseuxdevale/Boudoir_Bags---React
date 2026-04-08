<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    // ── Helpers ───────────────────────────────────────────────

    /**
     * Get a structured item list from the DB cart (authenticated users).
     */
    private function getDbCart(): array
    {
        $cart = Cart::with([
            'items.product.images',
            'items.product.category',
            'items.product.inventory',
        ])->firstOrCreate(['user_id' => Auth::id()]);

        $items = $cart->items->map(fn($item) => [
            'id'       => $item->id,
            'name'     => $item->product->name,
            'price'    => (float) $item->unit_price,
            'quantity' => $item->quantity,
            'image'    => optional($item->product->images->first())->image_url,
            'category' => $item->product->category?->name ?? '',
            'stock'    => $item->product->inventory?->quantity ?? 0,
        ])->values()->all();

        return ['cart' => $cart, 'items' => $items];
    }

    /**
     * Get a structured item list from the session cart (guests).
     * Each session cart entry: { product_id, quantity, unit_price }
     */
    private function getSessionCart(): array
    {
        $sessionItems = session('cart', []);
        $items = [];

        foreach ($sessionItems as $entry) {
            $product = Product::with(['images', 'category', 'inventory'])
                ->find($entry['product_id']);

            if (!$product) continue;

            $items[] = [
                // For session cart, use product_id as the "id" for update/remove
                'id'       => $entry['product_id'],
                'name'     => $product->name,
                'price'    => (float) $entry['unit_price'],
                'quantity' => $entry['quantity'],
                'image'    => optional($product->images->first())->image_url,
                'category' => $product->category?->name ?? '',
                'stock'    => $product->inventory?->quantity ?? 0,
            ];
        }

        return ['items' => $items];
    }

    /**
     * Build the cart summary payload shared with the frontend.
     */
    private function buildPayload(array $items): array
    {
        $subtotal = array_sum(array_map(fn($i) => $i['price'] * $i['quantity'], $items));
        $shipping = $subtotal >= 2500 ? 0 : 250;

        return [
            'items'       => $items,
            'subtotal'    => $subtotal,
            'shipping'    => $shipping,
            'total'       => $subtotal + $shipping,
            'total_items' => array_sum(array_column($items, 'quantity')),
        ];
    }

    // ── GET /cart ─────────────────────────────────────────────

    public function index()
    {
        if (Auth::check()) {
            $data  = $this->getDbCart();
            $items = $data['items'];
        } else {
            $data  = $this->getSessionCart();
            $items = $data['items'];
        }

        return Inertia::render('CartPage', [
            'cart' => $this->buildPayload($items),
        ]);
    }

    // ── POST /cart/add ────────────────────────────────────────

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::with('inventory')->findOrFail($request->product_id);
        $stock   = $product->inventory?->quantity ?? 0;

        if (Auth::check()) {
            // ── DB cart ──
            $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

            $existing = CartItem::where([
                'cart_id'    => $cart->id,
                'product_id' => $product->id,
            ])->first();

            $requestedQty = $existing
                ? $existing->quantity + $request->quantity
                : $request->quantity;

            if ($requestedQty > $stock) {
                return back()->withErrors(['stock' => "Only {$stock} item(s) available."]);
            }

            if ($existing) {
                $existing->increment('quantity', $request->quantity);
            } else {
                CartItem::create([
                    'cart_id'    => $cart->id,
                    'product_id' => $product->id,
                    'quantity'   => $request->quantity,
                    'unit_price' => $product->price,
                ]);
            }
        } else {
            // ── Session cart ──
            $cart = session('cart', []);
            $key  = null;

            foreach ($cart as $i => $entry) {
                if ($entry['product_id'] == $product->id) {
                    $key = $i;
                    break;
                }
            }

            $requestedQty = $key !== null
                ? $cart[$key]['quantity'] + $request->quantity
                : $request->quantity;

            if ($requestedQty > $stock) {
                return back()->withErrors(['stock' => "Only {$stock} item(s) available."]);
            }

            if ($key !== null) {
                $cart[$key]['quantity'] = $requestedQty;
            } else {
                $cart[] = [
                    'product_id' => $product->id,
                    'quantity'   => $request->quantity,
                    'unit_price' => (float) $product->price,
                ];
            }

            session(['cart' => $cart]);
        }

        return back()->with('success', 'Item added to cart.');
    }

    // ── PATCH /cart/{id} ──────────────────────────────────────
    // For auth users: {id} = CartItem ID
    // For guests:     {id} = product_id

    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        if (Auth::check()) {
            $item = CartItem::with('product.inventory')->findOrFail($id);
            $cart = Cart::where('user_id', Auth::id())->firstOrFail();
            abort_if($item->cart_id !== $cart->id, 403);

            $stock = $item->product?->inventory?->quantity ?? 0;
            if ($request->quantity > $stock) {
                return back()->withErrors(['stock' => "Only {$stock} item(s) available."]);
            }

            $item->update(['quantity' => $request->quantity]);
        } else {
            $cart    = session('cart', []);
            $updated = false;

            foreach ($cart as &$entry) {
                if ($entry['product_id'] == $id) {
                    $product = Product::with('inventory')->find($id);
                    $stock   = $product?->inventory?->quantity ?? 0;

                    if ($request->quantity > $stock) {
                        return back()->withErrors(['stock' => "Only {$stock} item(s) available."]);
                    }

                    $entry['quantity'] = $request->quantity;
                    $updated = true;
                    break;
                }
            }
            unset($entry);

            if ($updated) session(['cart' => $cart]);
        }

        return back();
    }

    // ── DELETE /cart/{id} ─────────────────────────────────────

    public function remove($id)
    {
        if (Auth::check()) {
            $item = CartItem::findOrFail($id);
            $cart = Cart::where('user_id', Auth::id())->firstOrFail();
            abort_if($item->cart_id !== $cart->id, 403);
            $item->delete();
        } else {
            $cart = session('cart', []);
            $cart = array_values(
                array_filter($cart, fn($entry) => $entry['product_id'] != $id)
            );
            session(['cart' => $cart]);
        }

        return back()->with('success', 'Item removed from cart.');
    }

    // ── DELETE /cart (clear all) ──────────────────────────────

    public function clear()
    {
        if (Auth::check()) {
            $cart = Cart::where('user_id', Auth::id())->first();
            $cart?->items()->delete();
        } else {
            session()->forget('cart');
        }

        return back();
    }

    // ── Merge session cart → DB on login ─────────────────────
    // Call this from your LoginController after Auth::login()

    public static function mergeSessionCartToDb(): void
    {
        $sessionCart = session('cart', []);
        if (empty($sessionCart)) return;

        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        foreach ($sessionCart as $entry) {
            $product = Product::with('inventory')->find($entry['product_id']);
            if (!$product) continue;

            $existing = CartItem::where([
                'cart_id'    => $cart->id,
                'product_id' => $product->id,
            ])->first();

            $stock        = $product->inventory?->quantity ?? 0;
            $mergedQty    = min(
                ($existing?->quantity ?? 0) + $entry['quantity'],
                $stock
            );

            if ($existing) {
                $existing->update(['quantity' => $mergedQty]);
            } else {
                CartItem::create([
                    'cart_id'    => $cart->id,
                    'product_id' => $product->id,
                    'quantity'   => $mergedQty,
                    'unit_price' => $entry['unit_price'],
                ]);
            }
        }

        session()->forget('cart');
    }
}
