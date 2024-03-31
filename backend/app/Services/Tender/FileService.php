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
            $file = new File();
            $file->tender_id = $tender->id;
            $file->url = Storage::url($path);
            $file->user_id = $data['customer_id'];
            $file->save();
        }
    }
}