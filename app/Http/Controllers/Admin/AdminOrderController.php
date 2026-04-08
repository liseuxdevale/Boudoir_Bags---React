<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller {
    public function index(Request $request) {
        $query = Order::with('user', 'items', 'shippingAddress', 'payment')->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by order number or customer name
        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->q}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->q}%"));
            });
        }

        return Inertia::render('Admin/AdminOrders', [
            'orders'  => $query->paginate(6)->withQueryString(),
            'filters' => $request->only(['status', 'q']),
        ]);
    }

    public function updateStatus(Request $request, $id) {
        $request->validate([
            'status' => 'required|in:pending,confirmed,shipping,delivered,cancelled',
            'note'   => 'nullable|string|max:500',
        ]);

        $order = Order::findOrFail($id);

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Order status updated.');
    }

    public function destroy($id) {
        $order = Order::findOrFail($id);
        $order->delete();

        return back()->with('success', 'Order deleted.');
    }
}
