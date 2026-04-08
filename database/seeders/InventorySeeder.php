<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder {
    public function run(): void {
        $products = Product::all();

        foreach ($products as $product) {
            Inventory::firstOrCreate(
                ['product_id' => $product->id],
                [
                    'quantity'            => rand(10, 50),
                    'low_stock_threshold' => 5,
                ]
            );
        }
    }
}
