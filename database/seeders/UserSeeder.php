<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder {
    public function run(): void {
        // Admin account
        $admin = User::firstOrCreate(
            ['email' => 'admin@boudoir.com'],
            [
                'name'     => 'Super Admin',
                'password' => Hash::make('admin123'),
                'phone'    => '09171234567',
                'role'     => 'admin',
            ]
        );

        // Sample customers
        $customers = [
            [
                'name'     => 'Maria Santos',
                'email'    => 'maria@example.com',
                'password' => Hash::make('password'),
                'phone'    => '09181234567',
                'role'     => 'customer',
            ],
            [
                'name'     => 'Anna Reyes',
                'email'    => 'anna@example.com',
                'password' => Hash::make('password'),
                'phone'    => '09191234567',
                'role'     => 'customer',
            ],
            [
                'name'     => 'Clara Cruz',
                'email'    => 'clara@example.com',
                'password' => Hash::make('password'),
                'phone'    => '09201234567',
                'role'     => 'customer',
            ],
        ];

        foreach ($customers as $data) {
            $user = User::firstOrCreate(['email' => $data['email']], $data);
            // Create cart for each customer
            Cart::firstOrCreate(['user_id' => $user->id]);
        }
    }
}
