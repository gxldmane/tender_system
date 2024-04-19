<?php

namespace App\Services\Tender;

use App\Models\File;
use App\Models\Tender;
use Illuminate\Support\Facades\Storage;

class FileService
{

    public function store($files, Tender $tender, $data)
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