<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'hash',
        'customer_name',
        'customer_phone',
        'customer_address',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'voucher_code',
        'discount_amount',
        'shipping_fee',
        'additional_fee',
        'order_type',
        'pickup_delivery_date',
        'pickup_delivery_time'
    ];

    protected $casts = [
        'total_amount' => 'integer',
        'discount_amount' => 'integer',
        'shipping_fee' => 'integer',
        'additional_fee' => 'integer'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'id');
    }
}
