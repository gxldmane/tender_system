<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Tender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $file = $request->file('file');
        $path = Storage::put('/files', $file);

        $model = new File();

        $model->tender_id = 1;
        $model->user_id = 1;
        $model->url = Storage::url($path);

        $model->save();

        return $model;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
