<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_number', 'status',
        'subtotal', 'shipping_fee', 'total_amount',
        'payment_method', 'notes',
    ];

    protected function casts(): array {
        return [
            'subtotal'     => 'decimal:2',
            'shipping_fee' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    // Relationships
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress() {
        return $this->hasOne(ShippingAddress::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }

    public function statusLogs() {
        return $this->hasMany(OrderStatusLog::class)->latest();
    }

    // Helpers
    public static function generateOrderNumber(): string {
        return 'BB-' . strtoupper(uniqid());
    }
}
