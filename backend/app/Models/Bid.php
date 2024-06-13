<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Bid extends Model
{
    use HasFactory;

    /**
     * @var string[]
     */
    protected $fillable = [
        'tender_id',
        'user_id',
        'company_id',
        'price',
        'status'
    ];

    /**
     * @return BelongsTo
     */
    public function tender(): BelongsTo
    {
        return $this->belongsTo(Tender::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany
     */
    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class);
    }

    /**
     * @return mixed
     */
    public function ScopeActive()
    {
        return $this->where('status', 'active');
    }
}
