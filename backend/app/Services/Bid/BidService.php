<?php

namespace App\Services\Bid;

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
    protected OtherBidsService $otherBidsService;

    public function __construct(OtherBidsService $otherBidsService)
    {
        $this->otherBidsService = $otherBidsService;
    }


    public function getTenderBids(Tender $tender): Application|Response|BidCollection|\Illuminate\Contracts\Foundation\Application|ResponseFactory
    {
        $user = Auth::user();
        if ($tender->customer_id != $user->id) {
            return response([
                'message' => 'Not found'
            ], 404);
        }

        $bids = $tender->bids()->paginate(10);

        return new BidCollection($bids);
    }

    public function getSendedBids(): BidCollection
    {
        $user = Auth::user();
        $bids = $user->bids()->paginate(10);
        return new BidCollection($bids);
    }

    public function store($data, User $user, Tender $tender)
    {
        if ($tender->status === 'closed' || $tender->status === 'pending') {
            return response()->json(['message' => 'Tender is pending or closed.'], 403);
        }

        $existingBid = Bid::query()->where('user_id', $user->id)->where('tender_id', $tender->id)->first();

        if ($existingBid) {
            return response([
                'message' => 'bid already exists'
            ], 401);
        }

        $data['tender_id'] = $tender->id;
        $data['user_id'] = $user->id;
        $data['company_id'] = $user->company->id;
        $data['status'] = 'pending';
        $tender->bids()->create($data);

        return response()->json([
            'message' => 'bid created successfully',
        ]);
    }

    public function acceptBid(Tender $tender, Bid $bid)
    {
        if ($tender->status === "closed" || $tender->status === "active") {
            return response()->json(['message' => 'Tender is closed or active.'], 403);
        }
        if ($tender->customer_id !== Auth::id() || !$tender->bids->contains($bid)) {
            return response()->json(['message' => 'You are not allowed.'], 403);
        }

        $bid->status = "accepted";
        $tender->status = "closed";
        $tender->executor_id = $bid->user_id;

        $bid->save();

        $tender->save();

        $user = $bid->user;

        $user->notify(new BidAccepted($bid));

        $otherBids = $tender->bids->where('id', '!=', $bid->id);

        $this->otherBidsService->rejectBids($otherBids);

        return response()->json([
            'message' => 'bid accepted successfully',
        ], 200);


    }


    public function destroy(Tender $tender, User $user)
    {

        $bid = Bid::query()->where('user_id', $user->id)->where('tender_id', $tender->id)->first();
        if (!$bid) {
            return response([
                'message' => 'Not found'
            ], 404);
        }

        $bid->delete();

        return response()->json([
            'message' => 'bid deleted successfully'
        ], 200);
    }

    public function hasBid(Tender $tender)
    {
        $user = Auth::user();

        if ($tender->bids()->where('user_id', $user->id)->exists()) {
            return true;
        }
        return false;
    }
}