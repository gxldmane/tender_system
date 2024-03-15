<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bid\BidStoreRequest;
use App\Http\Requests\Tender\TenderStoreRequest;
use App\Http\Requests\Tender\TenderUpdateRequest;
use App\Http\Resources\api\Tender\TenderCollection;
use App\Http\Resources\api\Tender\TenderResource;
use App\Models\Bid;
use App\Models\File;
use App\Models\Tender;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TenderController extends Controller
{
    public function __construct() {
        $this->authorizeResource(Tender::class, 'tender');
    }


    public function index()
    {
        $tenders = Tender::query()->paginate(10);

        return new TenderCollection($tenders);
    }

    public function store(TenderStoreRequest $request)
    {
        $data = $request->validated();
        $files = $data['files'];
        unset($data['files']);
        $data['customer_id'] = User::query()->inRandomOrder()->first()->id;

        $tender = Tender::query()->create($data);

        foreach ($files as $file) {
            $path = Storage::disk('public')->put('', $file);
            $file = new File();
            $file->tender_id = $tender->id;
            $file->url = Storage::url($path);
            $file->user_id = $data['customer_id'];
            $file->save();
        }

        return new TenderResource($tender);
    }

    public function show(Tender $tender)
    {
        return new TenderResource($tender->load('files'));
    }

    public function update(TenderUpdateRequest $request, Tender $tender)
    {
        $data = $request->validated();

        $tender = $tender->update($data);

        return new TenderResource($tender);
    }

    public function destroy(Tender $tender)
    {
        $tender->files->delete();
        $tender->bids->delete();
        $tender->delete();

        return response()->json([
            'message' => 'tender deleted successfully'
        ]);
    }
}
