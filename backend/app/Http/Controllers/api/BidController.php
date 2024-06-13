<?php

namespace App\Http\Controllers\api;

use App\Actions\RejectBidsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Bid\BidStoreRequest;
use App\Models\Bid;
use App\Models\Tender;
use App\Services\Bid\BidService;
use Illuminate\Http\Request;
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
        $bids = $this->bidService->getTenderBids($tender);

        if ($bids) {
            return $bids;
        }
        return response()->json(['message' => 'No bids found'], 404);
    }

    public function getSendBids()
    {
        return $this->bidService->getSendBids();
    }

    public function store(BidStoreRequest $request, Tender $tender)
    {
        if ($tender->status === 'closed' || $tender->status === 'pending') {
            return response()->json(['message' => 'Tender is pending or closed.'], 403);
        }

        $data = $request->validated();
        $user = Auth::user();

        $bid = $this->bidService->store($data, $user, $tender);

        if ($bid) {
            return response([
                'message' => 'bid already exists'
            ], 401);
        }

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

        $this->bidService->acceptBid($tender, $bid, new RejectBidsAction());

        return response()->json([
            'message' => 'bid accepted successfully',
        ], 200);

    }

    public function destroy(Tender $tender)
    {
        $user = Auth::user();

        $bid = $this->bidService->destroy($tender, $user);

        if (!$bid) {
            return response([
                'message' => 'Not found'
            ], 404);
        }

        return response()->json([
            'message' => 'bid deleted successfully'
        ], 200);
    }

    public function haveBid(Tender $tender)
    {
        return $this->bidService->haveBid($tender);
    }
}
