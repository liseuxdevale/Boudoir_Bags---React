<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder {
    public function run(): void {
        $products = [
            // Bags
            [
                'category' => 'Handbags',
                'name'     => 'Brianna Leather Handbag',
                'subtitle' => 'Timeless everyday carry',
                'price'    => 1299.00,
                'img'      => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
            ],
            [
                'category' => 'Handbags',
                'name'     => 'Cupid Heart Handbag',
                'subtitle' => 'Soft and luxurious feel',
                'price'    => 1499.00,
                'img'      => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
            ],
            [
                'category' => 'Handbags',
                'name'     => 'Royal Blue Handbag',
                'subtitle' => 'Your Highness\'s new favorite',
                'price'    => 999.00,
                'img'      => 'https://images.unsplash.com/photo-1594938298603-c8148c4b4457?w=400',
            ],

           //Backpacks
            [
                'category' => 'Backpacks',
                'name'     => 'Dark Genius',
                'subtitle' => 'For middle schoolers and teens',
                'price'    => 399.00,
                'img'      => 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
            ],
            [
                'category' => 'Backpacks',
                'name'     => 'Classic Backpack',
                'subtitle' => 'Larger size for more storage',
                'price'    => 499.00,
                'img'      => 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400',
            ],
            [
                'category' => 'Backpacks',
                'name'     => 'Sean Classic Backpack',
                'subtitle' => 'Glossy finish with a pop of color',
                'price'    => 249.00,
                'img'      => 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
            ],

            // Tote Bags
            [
                'category' => 'Tote Bags',
                'name'     => 'Lexi Belt Totebag',
                'subtitle' => 'Black and fits your aura',
                'price'    => 699.00,
                'img'      => 'https://images.unsplash.com/photo-1627123423817-c0ba8b0e1f82?w=400',
            ],
            [
                'category' => 'Tote Bags',
                'name'     => 'Padel Totebag',
                'subtitle' => 'Plain and simple',
                'price'    => 549.00,
                'img'      => 'https://images.unsplash.com/photo-1601592494260-d7a1a9c00d29?w=400',
            ],
            [
                'category' => 'Tote Bags',
                'name'     => 'Flawlessly Brown',
                'subtitle' => 'Unique brown shade with a glossy finish',
                'price'    => 799.00,
                'img'      => 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400',
            ],

            // Crossbody
            [
                'category' => 'Crossbody Bags',
                'name'     => 'Native Black Leather',
                'subtitle' => 'Minimalist design with a sleek black finish',
                'price'    => 1199.00,
                'img'      => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
            ],
            [
                'category' => 'Crossbody Bags',
                'name'     => 'The ReinCarnation',
                'subtitle' => 'Creamy white with a pop of color',
                'price'    => 899.00,
                'img'      => 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400',
            ],
            [
                'category' => 'Crossbody Bags',
                'name'     => 'YinYang Hooked Bag',
                'subtitle' => 'Hooked slings',
                'price'    => 1099.00,
                'img'      => 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=400',
            ],

            //Shoulder Bags
            [
                'category' => 'Shoulder Bags',
                'name'     => 'Cream Luxurious',
                'subtitle' => 'Soft and luxurious finish',
                'price'    => 649.00,
                'img'      => 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
            ],
            [
                'category' => 'Shoulder Bags',
                'name'     => 'Margarita Shoulder Bag',
                'subtitle' => 'Premium blue leather finish',
                'price'    => 1799.00,
                'img'      => 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400',
            ],
            [
                'category' => 'Shoulder Bags',
                'name'     => 'Mint Belted Bag',
                'subtitle' => 'Mint green with a belt detail',
                'price'    => 799.00,
                'img'      => 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
            ],

            // Clutches
            [
                'category' => 'Clutch Bags',
                'name'     => 'Goldie Rich',
                'subtitle' => 'For special nights out',
                'price'    => 899.00,
                'img'      => 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400',
            ],
            [
                'category' => 'Clutch Bags',
                'name'     => 'Weaved Clutch',
                'subtitle' => 'Intricate weaved design',
                'price'    => 749.00,
                'img'      => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
            ],
            [
                'category' => 'Clutch Bags',
                'name'     => 'The Golden Hour',
                'subtitle' => 'Shiny gold clutch for evening glam',
                'price'    => 1099.00,
                'img'      => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
            ],

            // Travel Bags
            [
                'category' => 'Travel',
                'name'     => 'Mini Leather Backpack',
                'subtitle' => 'Cute and functional',
                'price'    => 1599.00,
                'img'      => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
            ],
            [
                'category' => 'Backpacks',
                'name'     => 'Canvas Backpack',
                'subtitle' => 'Casual everyday backpack',
                'price'    => 1299.00,
                'img'      => 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400',
            ],
            [
                'category' => 'Backpacks',
                'name'     => 'Quilted Backpack',
                'subtitle' => 'Padded quilted exterior',
                'price'    => 1399.00,
                'img'      => 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=400',
            ],

            // Travel
            [
                'category' => 'Travel',
                'name'     => 'Weekender Duffel',
                'subtitle' => 'Perfect for short trips',
                'price'    => 2499.00,
                'img'      => 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
            ],
            [
                'category' => 'Travel',
                'name'     => 'Passport Holder',
                'subtitle' => 'Keep your docs safe',
                'price'    => 449.00,
                'img'      => 'https://images.unsplash.com/photo-1594938298603-c8148c4b4457?w=400',
            ],
            [
                'category' => 'Travel',
                'name'     => 'Luggage Tag Set',
                'subtitle' => 'Leather luggage tags x3',
                'price'    => 349.00,
                'img'      => 'https://images.unsplash.com/photo-1601592494260-d7a1a9c00d29?w=400',
            ],
        ];

        $sortOrder = 1;

        foreach ($products as $data) {
            $category = Category::where('name', $data['category'])->first();
            if (!$category) continue;

            $product = Product::firstOrCreate(
                ['name' => $data['name']],
                [
                    'category_id' => $category->id,
                    'subtitle'    => $data['subtitle'],
                    'price'       => $data['price'],
                    'category'    => $data['category'],
                    'active'      => true,
                    'sort_order'  => $sortOrder++,
                ]
            );

            // Add image if not already added
            if ($product->wasRecentlyCreated) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url'  => $data['img'],
                    'is_primary' => true,
                    'sort_order' => 1,
                ]);
            }
        }
    }
}
