<?php

namespace App\Actions;

use App\Models\File;
use App\Models\Tender;
use Illuminate\Support\Facades\Storage;

class StoreFilesAction
{
    public function handle(array $files, Tender $tender, $data): void
    {
        foreach ($files as $file) {
            $path = Storage::disk('public')->put('', $file);
            $newFile = new File();
            $newFile->tender_id = $tender->id;
            $newFile->name = ucfirst($file->getClientOriginalName());
            $newFile->url = $path;
            $newFile->user_id = $data['customer_id'];
            $newFile->save();
        }
    }
}
