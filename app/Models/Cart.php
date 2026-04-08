<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];

    // ── Relationships ─────────────────────────────────────────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    // ── Accessors ─────────────────────────────────────────────
    public function getTotalAttribute(): float
    {
        return $this->items->sum(
            fn($item) => (float) ($item->unit_price ?? 0) * $item->quantity
        );
    }

    public function getSubtotalAttribute(): float
    {
        return $this->getTotalAttribute();
    }

    public function getCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public function getShippingAttribute(): float
    {
        return $this->getSubtotalAttribute() >= 2500 ? 0 : 250;
    }

    public function getGrandTotalAttribute(): float
    {
        return $this->getSubtotalAttribute() + $this->getShippingAttribute();
    }
}
