<?php

use App\Http\Controllers\api\BidController;
use App\Http\Controllers\api\CategoryController;
use App\Http\Controllers\api\FileController;
use App\Http\Controllers\api\RegionController;
use App\Http\Controllers\api\TenderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::controller(BidController::class)->group(function () {
    Route::get('bids/{tender}', 'index');
});

Route::apiResource('categories', CategoryController::class);
Route::apiResource('files', FileController::class);
Route::apiResource('regions', RegionController::class);
Route::apiResource('tenders', TenderController::class);
