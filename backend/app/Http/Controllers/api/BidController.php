<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bid\BidStoreRequest;
use App\Models\Bid;
use App\Models\Tender;
use App\Services\Bid\BidService;
use Illuminate\Support\Facades\Auth;

class BidController extends Controller
{
    protected BidService $bidService;

    public function __construct(BidService $bidService)
    {
        $this->bidService = $bidService;
    }

    public function getTenderBids(Tender $tender)
    {
        return $this->bidService->getTenderBids($tender);
    }

    public function getSendedBids()
    {
        return $this->bidService->getSendedBids();
    }

    public function store(BidStoreRequest $request, Tender $tender)
    {
        $data = $request->validated();
        $user = Auth::user();

        return $this->bidService->store($data, $user, $tender);
    }

    public function acceptBid(Tender $tender, Bid $bid)
    {
        // TODO выести в сервис

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

        // TODO: send notification to executor

        $tender->save();

        $otherBids = $tender->bids;
        foreach ($otherBids as $otherBid) {
            if ($otherBid->id != $bid->id) {
                $otherBid->status = "rejected";
                $otherBid->save();

                // TODO: send notification to all rejected bids
            }
        }
        return $bid;
    }

    public function destroy(Tender $tender)
    {
        $user = Auth::user();

        return $this->bidService->destroy($tender, $user);
    }
}
