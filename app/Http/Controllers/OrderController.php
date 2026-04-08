<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingAddress;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    // ── GET /checkout ─────────────────────────────────────────
    // Show the checkout page with cart data
    public function checkout()
    {
        $cart = Cart::with([
            'items.product.images',
            'items.product.category',
        ])->firstOrCreate(['user_id' => Auth::id()]);

        $items = $cart->items->map(fn($item) => [
            'id'       => $item->id,
            'name'     => $item->product->name,
            'price'    => (float) $item->unit_price,
            'quantity' => $item->quantity,
            'image'    => $item->product->images->first()?->image_url,
            'category' => $item->product->category?->name ?? '',
        ]);

        $subtotal = $items->sum(fn($i) => $i['price'] * $i['quantity']);
        $shipping = $subtotal >= 2500 ? 0 : 250;
        $total    = $subtotal + $shipping;

        return Inertia::render('CheckoutPage', [
            'cart' => [
                'items'       => $items,
                'subtotal'    => $subtotal,
                'shipping'    => $shipping,
                'total'       => $total,
                'total_items' => $items->sum(fn($i) => $i['quantity']),
            ],
        ]);
    }

    // ── POST /checkout ────────────────────────────────────────
    // Place the order then redirect to confirmation page
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'      => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
            'address'        => 'required|string|max:500',
            'city'           => 'required|string|max:100',
            'zip'            => 'required|string|max:10',
            'payment_method' => 'required|in:cod,gcash,card', // ← fixed
        ]);

        $cart = Cart::with('items.product.inventory')
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($cart->items->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        // ── Wrap in a transaction so everything is atomic ─────
        $order = DB::transaction(function () use ($cart, $validated) {

            $items    = $cart->items;
            $subtotal = $items->sum(fn($i) => (float) $i->unit_price * $i->quantity);
            $shipping = $subtotal >= 2500 ? 0 : 250;
            $total    = $subtotal + $shipping;

            // 1. Create the order
            $order = Order::create([
                'user_id'        => Auth::id(),
                'order_number'   => 'ORD-' . strtoupper(uniqid()),
                'status'         => 'pending',
                'subtotal'       => $subtotal,
                'shipping_fee'   => $shipping,
                'total_amount'   => $total,
                'payment_method' => $validated['payment_method'], // ← kept for orders table
            ]);

            // 2. Create order items
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product->name,
                    'quantity'     => $item->quantity,
                    'unit_price'   => (float) $item->unit_price,
                    'subtotal'     => (float) $item->unit_price * $item->quantity,
                ]);
            }

            // 3. Create shipping address (only columns that exist in migration)
            ShippingAddress::create([
                'order_id'  => $order->id,
                'full_name' => $validated['full_name'],
                'phone'     => $validated['phone'],
                'address'   => $validated['address'],
                'city'      => $validated['city'],
                'province'  => '',
                'zip_code'  => $validated['zip'],
            ]);

            // 4. Create payment record
            Payment::create([
                'order_id' => $order->id,
                'method'   => $validated['payment_method'],
                'status'   => 'pending',
                'amount'   => $total,
            ]);

            // 5. Deduct inventory stock for each ordered item
            foreach ($items as $item) {
                $item->product->inventory?->decrement('quantity', $item->quantity);
            }

            // 6. Clear the cart
            $cart->items()->delete();

            return $order;
        });

        // ── Redirect to confirmation page ─────────────────────
        return redirect()->route('order.confirmation', $order->id);
    }

    // ── GET /order/confirmation/{order} ───────────────────────
    public function confirmation(Order $order)
    {
        // Security: ensure the order belongs to the logged-in user
        abort_if($order->user_id !== Auth::id(), 403);

        $order->load(['items.product.images', 'shippingAddress', 'payment']);

        return Inertia::render('ConfirmationPage', [
            'order' => [
                'id'             => $order->id,
                'order_number'   => $order->order_number,
                'status'         => ucfirst($order->status),
                'subtotal'       => (float) $order->subtotal,
                'shipping'       => (float) $order->shipping_fee,
                'total'          => (float) $order->total_amount,
                'payment_method' => $order->payment?->method,
                'items'          => $order->items->map(fn($item) => [
                    'id'       => $item->id,
                    'name'     => $item->product_name,
                    'price'    => (float) $item->unit_price,
                    'quantity' => $item->quantity,
                    'image'    => $item->product->images->first()?->image_url,
                ]),
                'shipping_info'  => [
                    'full_name' => $order->shippingAddress?->full_name,
                    'phone'     => $order->shippingAddress?->phone,
                    'address'   => $order->shippingAddress?->address,
                    'city'      => $order->shippingAddress?->city,
                    'zip'       => $order->shippingAddress?->zip_code,
                ],
            ],
        ]);
    }
}
