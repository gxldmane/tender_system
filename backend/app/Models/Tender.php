<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tender extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_price',
        'category_id',
        'region_id',
        'customer_id',
        'executor_id',
        'until_date',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function executor()
    {
        return User::query()->where('id', $this->executor_id)->first()->get();
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }
}
