<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bid\BidStoreRequest;
use App\Http\Resources\api\Bid\BidCollection;
use App\Http\Resources\api\Bid\BidResource;
use App\Http\Resources\api\Tender\TenderResource;
use App\Models\Bid;
use App\Models\Tender;
use Illuminate\Support\Facades\Auth;

class BidController extends Controller
{

    public function index(Tender $tender)
    {
        $bids = $tender->bids()->paginate(10);

        return new BidCollection($bids);
    }

    public function store(BidStoreRequest $request, Tender $tender)
    {
        $data = $request->validated();
        $user = Auth::user();

        $existingBid = Bid::query()->where('user_id', $user->id)->where('tender_id', $tender->id)->first();
        if ($existingBid) {
            return response([
                'message' => 'bid already exists'
            ], 401);
        }
        $data['tender_id'] = $tender->id;
        $data['user_id'] = $user->id;
        $data['company_id'] = $user->company->id;
        $tender->bids()->create($data);
        return response()->json([
            'message' => 'bid created successfully',
        ]);
    }

    public function show(Bid $bid)
    {
        return new BidResource($bid);
    }

    public function destroy(Tender $tender)
    {

        $user = Auth::user();
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
}
