<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model {
    use HasFactory;

    protected $fillable = [
        'order_id', 'full_name', 'phone',
        'address', 'city', 'province', 'zip_code',
    ];

    // Relationships
    public function order() {
        return $this->belongsTo(Order::class);
    }
}
