<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'card_number',
        'type',
        'details',
        'amount',
        'category',
        'vendor',
        'is_recurring'
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'is_recurring' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
