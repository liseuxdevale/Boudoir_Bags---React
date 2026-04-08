<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CartController;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller {
    public function show() {
        return Inertia::render('RegisterPage');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name'     => 'required|string|max:150',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone'    => $validated['phone'] ?? null,
            'role'     => 'customer',
        ]);

        // Create a cart for the new user
        Cart::create(['user_id' => $user->id]);

        Auth::login($user);
        $request->session()->regenerate();

        // Merge any guest session cart items into the new user's DB cart
        CartController::mergeSessionCartToDb();

        return redirect()->route('shop');
    }
}
