<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    use HasFactory;

    /**
     * @var string[]
     */
    protected $fillable = [
        'url',
        'tender_id',
        'user_id',
        'name',
    ];

    /**
     * @return BelongsTo
     */
    public function tender(): BelongsTo
    {
        return $this->belongsTo(Tender::class);
    }
}
