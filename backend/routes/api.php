<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\BidController;
use App\Http\Controllers\api\CategoryController;
use App\Http\Controllers\api\DownloadController;
use App\Http\Controllers\api\RegionController;
use App\Http\Controllers\api\TenderController;
use App\Http\Controllers\api\CompanyController;
use App\Http\Controllers\api\UserController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'register')->middleware(StartSession::class);
    Route::post('login', 'login')->middleware(StartSession::class);
 });

 Route::apiResource('categories', CategoryController::class);
 Route::apiResource('regions', RegionController::class);
 Route::apiResource('companies', CompanyController::class);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::controller(TenderController::class)->group(function () {
        Route::get('/tenders', 'getActiveTenders');
        Route::get('/tenders/my', 'myTenders')->middleware('ability:customer');
        Route::post('/tenders', 'store')->middleware('ability:customer');
        Route::get('/tenders/{tender}', 'show');
        Route::patch('/tenders/{tender}','update')->middleware('ability:customer');
        Route::delete('/tenders/{tender}','destroy')->middleware('ability:customer');
    });
    Route::controller(BidController::class)->group(function () {
        Route::post('/tenders/{tender}/bids', 'store')->middleware('ability:executor');
        Route::delete('/tenders/{tender}/bids', 'destroy')->middleware('ability:executor');
        Route::get('/bids/{tender}', 'getTenderBids')->middleware('ability:customer');
        Route::get('/bids/{tender}/{bid}', 'acceptBid')->middleware('ability:customer');
        Route::get('/bids', 'getSendBids')->middleware('ability:executor');
        Route::get('/have-bid/{tender}', 'haveBid')->middleware('ability:executor');
    });

    Route::controller(UserController::class)->group(function () {
        Route::get('profile/notifications', 'getNotifications');
        Route::get('profile/unread', 'getUnreadNotifications');
        Route::get('profile/notifications/{id}', 'getNotification');
        Route::delete('profile/notifications/{id}', 'deleteNotification');
    });

    Route::get('download', [DownloadController::class, 'download']);
});

