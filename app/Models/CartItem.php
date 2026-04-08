<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'unit_price',
    ];

    protected $casts = [
        'unit_price' => 'float',
        'quantity'   => 'integer',
    ];

    // ── Relationships ─────────────────────────────────────────
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // ── Accessors ─────────────────────────────────────────────

    // Expose "price" so the frontend never gets null/NaN
    public function getPriceAttribute(): float
    {
        return (float) ($this->unit_price ?? $this->product?->price ?? 0);
    }

    public function getSubtotalAttribute(): float
    {
        return $this->getPriceAttribute() * $this->quantity;
    }
}
