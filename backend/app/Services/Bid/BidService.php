<?php

namespace App\Services\Bid;

use App\Actions\RejectBidsAction;
use App\Http\Resources\api\Bid\BidCollection;
use App\Models\Bid;
use App\Models\Tender;
use App\Models\User;
use App\Notifications\BidAccepted;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class BidService
{
    public function getTenderBids(Tender $tender): Application|Response|BidCollection|\Illuminate\Contracts\Foundation\Application|ResponseFactory|null
    {
        $user = Auth::user();

        if ($tender->customer_id != $user->id) {
            return null;
        }

        $bids = $tender->bids()->paginate(10);

        return new BidCollection($bids);
    }

    public function getSendBids(): BidCollection
    {
        $user = Auth::user();
        $bids = $user->bids()->paginate(10);
        return new BidCollection($bids);
    }

    public function store($data, User $user, Tender $tender): object|null
    {
        $existingBid = Bid::query()->where('user_id', $user->id)->where('tender_id', $tender->id)->first();

        if ($existingBid) {
            return $existingBid;
        }

        $data['tender_id'] = $tender->id;
        $data['user_id'] = $user->id;
        $data['company_id'] = $user->company->id;
        $data['status'] = 'pending';
        $tender->bids()->create($data);

        return null;

    }

    public function acceptBid(Tender $tender, Bid $bid, RejectBidsAction $action): void
    {
        $bid->status = "accepted";
        $tender->status = "closed";
        $tender->executor_id = $bid->user_id;

        $bid->save();

        $tender->save();

        $user = $bid->user;

        $user->notify(new BidAccepted($bid));

        $otherBids = $tender->bids->where('id', '!=', $bid->id);

        $action->handle($otherBids);
    }


    public function destroy(Tender $tender, User $user): object|null
    {
        $bid = Bid::query()->where('user_id', $user->id)->where('tender_id', $tender->id)->first();

        if (!$bid) {
            return null;
        }

        $bid->delete();

        return $bid;
    }

    public function haveBid(Tender $tender): bool
    {
        $user = Auth::user();
        $bid = $tender->bids()->where('user_id', $user->id)->first();
        if ($bid) {
            return true;
        }
        return false;
    }
}
