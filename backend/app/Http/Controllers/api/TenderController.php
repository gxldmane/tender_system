<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tender\TenderStoreRequest;
use App\Http\Requests\Tender\TenderUpdateRequest;
use App\Http\Resources\api\Tender\TenderCollection;
use App\Http\Resources\api\Tender\TenderResource;
use App\Models\Tender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TenderController extends Controller
{
    public function index()
    {
        $tenders = Tender::query()->paginate(10);

        return new TenderCollection($tenders);
    }

    public function store(TenderStoreRequest $request)
    {
        $data = $request->validated();
        $data['customerId'] = Auth::id();

        $tender = Tender::query()->create($data);

        return new TenderResource($tender);
    }

    public function show(Tender $tender)
    {
        return new TenderResource($tender);
    }

    public function update(TenderUpdateRequest $request, Tender $tender)
    {
        $data = $request->validated();

        if ($tender->customer_id === Auth::id()) {
            $tender = $tender->update($data);
            return new TenderResource($tender);
        } else {
            return response([
                'message' => 'access denied'
            ], 401);
        }


    }

    public function destroy(Tender $tender)
    {
        if ($tender->customer_id === Auth::id()) {
            $tender->delete();

            return response()->json([
                'message' => 'tender deleted successfully'
            ]);
        } else {
            return response([
                'message' => 'access denied'
            ], 401);
        }

    }
}
