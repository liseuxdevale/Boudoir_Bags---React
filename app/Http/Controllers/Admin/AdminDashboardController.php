<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller {
    public function index() {
        $totalRevenue   = Order::whereIn('status', ['delivered', 'shipped'])->sum('total_amount');
        $totalOrders    = Order::count();
        $totalProducts  = Product::where('active', 1)->count();
        $totalCustomers = User::where('role', 'customer')->count();

        $recentOrders = Order::with('user', 'shippingAddress')
            ->latest()
            ->take(5)
            ->get();

        // Last 6 months sales data
        $salesData = Order::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

            // Products by category for pie chart
            $productsByCategory = DB::table('products')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->where('products.active', 1)
                ->select('categories.name', DB::raw('COUNT(*) as count'))
                ->groupBy('categories.id', 'categories.name')
                ->get()
                ->pluck('count', 'name')
                ->toArray();
        // Low-stock products
        $lowStockThreshold = 10; // ← change this number to adjust what counts as "low stock"

        $lowStock = Product::with(['inventory', 'category', 'images'])
            ->whereHas('inventory', fn($q) => $q->where('quantity', '<=', 15))
            ->where('active', 1)
            ->take(10)
            ->get();

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => [
                'totalRevenue'   => $totalRevenue,
                'totalOrders'    => $totalOrders,
                'totalProducts'  => $totalProducts,
                'totalCustomers' => $totalCustomers,
            ],
            'recentOrders'       => $recentOrders,
            'salesData'          => $salesData,
            'productsByCategory' => $productsByCategory,
            'lowStock'           => $lowStock,
        ]);
    }
}
