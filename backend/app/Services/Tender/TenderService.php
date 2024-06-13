<?php

namespace App\Services\Tender;


use App\Actions\StoreFilesAction;
use App\Http\Resources\api\Tender\TenderCollection;
use App\Http\Resources\api\Tender\TenderResource;
use App\Models\Tender;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class TenderService
{
    public function getActiveTenders(): TenderCollection
    {
        $tenders = Tender::active()
            ->orderByDesc('created_at')
            ->paginate(12);
        return new TenderCollection($tenders);
    }

    public function myTenders(): TenderCollection
    {
        $tenders = Tender::query()->where('customer_id', Auth::user()->id)->paginate(10);
        return new TenderCollection($tenders);
    }

    public function store(array $data, StoreFilesAction $action): Application|Response|TenderResource|\Illuminate\Contracts\Foundation\Application|ResponseFactory|null
    {
        $tender = Tender::query()->where('customer_id', Auth::user()->id)->where('name', $data['name'])->first();

        if ($tender) {
            return null;
        }

        $files = $data['files'];

        unset($data['files']);

        $data['customer_id'] = Auth::user()->id;

        $tender = Tender::query()->create($data);

        $action->handle($files, $tender, $data);

        return new TenderResource($tender->load('files'));
    }

    public function update(Tender $tender, $data, $files, StoreFilesAction $action): TenderResource
    {
        $data['customer_id'] = Auth::user()->id;

        if ($files) {
            $tender->files()->delete();
            $action->handle($files, $tender, $data);
        }

        $tender->update($data);

        return new TenderResource($tender->load('files'));
    }

    public function destroy(Tender $tender): void
    {
        $tender->files()->delete();
        $tender->bids()->delete();
        $tender->delete();
    }
}
