<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware {
    protected $rootView = 'app';

    public function version(Request $request): ?string {
        return parent::version($request);
    }

    public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
            'cart_count' => $this->getCartCount($request),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
            ],
        ]);
    }

    private function getCartCount(Request $request): int {
        if (!$request->user()) return 0;
        $cart = Cart::where('user_id', $request->user()->id)->first();
        return $cart ? $cart->items()->sum('quantity') : 0;
    }
}
