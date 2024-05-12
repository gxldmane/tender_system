<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function download(Request $request)
    {
        $data = $request->query();

        $file = '/storage/'. $data['file'];

        if (!file_exists(public_path($file))) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $file = public_path($file);

        return response()->download($file);
    }
}
