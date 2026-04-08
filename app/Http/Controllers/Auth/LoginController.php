<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CartController;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller {
    public function show() {
        return Inertia::render('LoginPage');
    }

    public function store(Request $request) {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Ensure user has a cart
            Cart::firstOrCreate(['user_id' => Auth::id()]);

            // Merge any guest session cart items into the user's DB cart
            CartController::mergeSessionCartToDb();

            $user = Auth::user();
            return $user->role === 'admin'
                ? redirect()->route('admin')
                : redirect()->intended(route('shop'));
        }

        return back()->withErrors(['email' => 'Invalid email or password.'])->onlyInput('email');
    }

    public function destroy(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
