<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\api\Region\RegionCollection;
use App\Http\Resources\api\Region\RegionResource;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index()
    {
        $regions = Region::all();

        return new RegionCollection($regions);
    }

    public function show(Region $region)
    {
        return new RegionResource($region);
    }
}
