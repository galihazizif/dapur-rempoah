<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'amount',
        'is_active',
        'is_used'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_used' => 'boolean',
        'amount' => 'integer'
    ];
}
