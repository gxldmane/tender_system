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
        return $this->bidService->acceptBid($tender, $bid);
    }

    public function destroy(Tender $tender)
    {
        $user = Auth::user();

        return $this->bidService->destroy($tender, $user);
    }
}
