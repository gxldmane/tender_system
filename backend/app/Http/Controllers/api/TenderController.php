<?php

namespace App\Http\Controllers\api;

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


    public function index()
    {
        return $this->tenderService->index();
    }

    public function myTenders()
    {
        return $this->tenderService->myTenders();
    }

    public function store(TenderStoreRequest $request)
    {
        $data = $request->validated();

        return $this->tenderService->store($data);
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
        return $this->tenderService->destroy($tender);
    }
}
