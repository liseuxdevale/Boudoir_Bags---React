<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder {
    public function run(): void {
        $categories = [
            [
                'name'        => 'Handbags',
                'description' => 'Stylish everyday bags for every occasion.',
            ],
            [
                'name'        => 'Tote Bags',
                'description' => 'Compact tote bags for your essentials.',
            ],
            [
                'name'        => 'Backpacks',
                'description' => 'Large capacity backpacks.',
            ],
            [
                'name'        => 'Crossbody Bags',
                'description' => 'Hands-free crossbody bags.',
            ],
            [
                'name'        => 'Shoulder Bags',
                'description' => 'Comfortable shoulder bags.',
            ],
            [
                'name'        => 'Clutch Bags',
                'description' => 'Elegant clutches for special occasions.',
            ],
            [
                'name'        => 'Travel Bags',
                'description' => 'For travels and adventures.',
            ],
            [
                'name'        => 'Messenger Bags',
                'description' => 'Practical messenger bags for work and school.',
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name'        => $category['name'],
                    'description' => $category['description'],
                    'is_active'   => true,
                ]
            );
        }
    }
}
