<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('shipping_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->onDelete('cascade');
            $table->string('full_name', 150);
            $table->string('phone', 20);
            $table->text('address');
            $table->string('city', 100);
            $table->string('province', 100)->nullable();
            $table->string('zip_code', 10);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('shipping_addresses');
    }
};
