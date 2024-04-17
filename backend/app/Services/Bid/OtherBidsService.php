<?php

namespace App\Services\Bid;

use App\Models\Bid;
use App\Notifications\BidRejected;
use Illuminate\Support\Collection;

/**
 * @param Collection|Bid[] $bids
 */

class OtherBidsService
{
    public function rejectBids($bids)
    {
        foreach ($bids as $bid) {
            $bid->status = "rejected";
            $bid->save();
            $user = $bid->user;
            $user->notify(new BidRejected($bid));
        }
    }
}