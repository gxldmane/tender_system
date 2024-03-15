<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tender\TenderStoreRequest;
use App\Http\Requests\Tender\TenderUpdateRequest;
use App\Http\Resources\api\Tender\TenderCollection;
use App\Http\Resources\api\Tender\TenderResource;
use App\Models\File;
use App\Models\Tender;
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

    public function myTenders()
    {
        $tenders = Auth::user()->tenders();
        return new TenderCollection($tenders);
    }

    public function store(TenderStoreRequest $request)
    {
        $data = $request->validated();

        $tender = Tender::query()->where('customer_id', Auth::user()->id)->where('name', $data['name'])->first();

        if ($tender) {
            return response([
                'message' => 'tender already exists'
            ], 401);
        }

        $files = $data['files'];
        unset($data['files']);

        $data['customer_id'] = Auth::user()->id;

        $tender = Tender::query()->create($data);

        foreach ($files as $file) {
            $path = Storage::disk('public')->put('', $file);
            $file = new File();
            $file->tender_id = $tender->id;
            $file->url = Storage::url($path);
            $file->user_id = $data['customer_id'];
            $file->save();
        }
        return new TenderResource($tender->load('files'));
    }

    public function show(Tender $tender)
    {
        return new TenderResource($tender->load('files'));
    }

    public function update(TenderUpdateRequest $request, Tender $tender)
    {
        $data = $request->validated();

        $tender->update($data);

        return new TenderResource($tender->load('files'));
    }

    public function destroy(Tender $tender)
    {
        $tender->files()->delete();
        $tender->bids()->delete();
        $tender->delete();

        return response()->json([
            'message' => 'tender deleted successfully'
        ]);
    }
}
