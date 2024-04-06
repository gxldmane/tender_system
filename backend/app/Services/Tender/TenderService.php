<?php

namespace App\Services\Tender;


use App\Http\Resources\api\Tender\TenderCollection;
use App\Http\Resources\api\Tender\TenderResource;
use App\Models\Tender;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class TenderService
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }


    public function index(): TenderCollection
    {
        $tenders = Tender::query()->paginate(10);
        return new TenderCollection($tenders);
    }

    public function myTenders(): TenderCollection
    {
        $tenders = Tender::query()->where('customer_id', Auth::user()->id)->paginate(10);
        return new TenderCollection($tenders);
    }

    public function store($data): Application|Response|TenderResource|\Illuminate\Contracts\Foundation\Application|ResponseFactory
    {
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

        $this->fileService->store($files, $tender, $data);

        return new TenderResource($tender->load('files'));
    }

    public function destroy(Tender $tender): JsonResponse
    {
        $tender->files()->delete();
        $tender->bids()->delete();
        $tender->delete();

        return response()->json([
            'message' => 'tender deleted successfully'
        ]);
    }
}
