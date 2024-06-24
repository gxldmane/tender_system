<?php

namespace App\Actions;

use App\Notifications\BidRejected;

class RejectBidsAction
{
    public function handle($bids): void
    {
        foreach ($bids as $bid) {
            $bid->status = "rejected";
            $bid->save();
            $user = $bid->user;
            $user->notify(new BidRejected($bid));
        }
    }
}
