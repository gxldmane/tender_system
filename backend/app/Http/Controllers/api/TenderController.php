<?php

namespace App\Http\Controllers\api;

use App\Actions\StoreFilesAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tender\TenderStoreRequest;
use App\Http\Requests\Tender\TenderUpdateRequest;
use App\Http\Resources\api\Tender\TenderResource;
use App\Models\Tender;
use App\Services\Tender\TenderService;

class TenderController extends Controller
{
    protected TenderService $tenderService;

    public function __construct(TenderService $tenderService)
    {
        $this->authorizeResource(Tender::class, 'tender');
        $this->tenderService = $tenderService;
    }

    public function getActiveTenders()
    {
        return $this->tenderService->getActiveTenders();
    }

    public function myTenders()
    {
        return $this->tenderService->myTenders();
    }

    public function store(TenderStoreRequest $request)
    {
        $data = $request->validated();

        $tender = $this->tenderService->store($data, new StoreFilesAction());

        if(!$tender) {
            return response()->json([
                'message' => 'tender already exists'
            ], 409);
        }

        return $tender;
    }

    public function show(Tender $tender)
    {
        return new TenderResource($tender->load('files'));
    }

    public function update(TenderUpdateRequest $request, Tender $tender, )
    {
        $data = $request->validated();

        $files = $request->file('files');

        return $this->tenderService->update($tender, $data, $files, new StoreFilesAction());
    }

    public function destroy(Tender $tender)
    {
        $this->tenderService->destroy($tender);

        return response()->json([
            'message' => 'tender deleted successfully'
        ]);
    }
}
