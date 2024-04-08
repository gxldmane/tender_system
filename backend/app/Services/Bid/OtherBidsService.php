<?php

namespace App\Services\Bid;

use App\Models\Bid;

class OtherBidsService
{
    public function rejectBids(Bid $bid, Bid $otherBids)
    {
        foreach ($otherBids as $otherBid) {
            if ($otherBid->id != $bid->id) {
                $otherBid->status = "rejected";
                $otherBid->save();
                // TODO: send notification to all rejected bids
            }
        }
    }
}