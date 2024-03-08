<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bid\BidStoreRequest;
use App\Http\Resources\api\Bid\BidCollection;
use App\Http\Resources\api\Bid\BidResource;
use App\Models\Bid;
use App\Models\Tender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BidController extends Controller
{
    public function index(Tender $tender)
    {
        $bids = $tender->bids()->paginate(10);

        return new BidCollection($bids);
    }

    public function store(BidStoreRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        $data['userId'] = $user->id;

        $bid = Bid::query()->create($data);

        return new BidResource($bid);
    }

    public function show(Bid $bid)
    {
        return new BidResource($bid);
    }

    public function destroy(Bid $bid)
    {
        $bid->delete();

        return response()->json(
            [
                'message' => 'Bid deleted successfully'
            ],
        );
    }
}
