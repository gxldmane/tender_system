<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function download(Request $request)
    {
        $user = auth()->user();

        $data = $request->query();

        $file = '/storage/'. $data['file'];

        $file = public_path($file);

        return response()->download($file);
    }
}
