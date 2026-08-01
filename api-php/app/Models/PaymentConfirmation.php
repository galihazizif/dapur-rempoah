<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentConfirmation extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'order_id',
        'order_reference',
        'amount_paid',
        'notes',
        'status',
        'payment_date',
        'validity',
        'image_url'
    ];

    protected $casts = [
        'amount_paid' => 'integer',
        'status' => 'integer'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }
}
