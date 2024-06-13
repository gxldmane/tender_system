<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\api\Notification\NotificationResourceFactory;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    public function getNotification($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return NotificationResourceFactory::make($notification);
    }

    public function deleteNotification($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->delete();
        return response()->noContent();
    }

    public function getNotifications()
    {
        $user = auth()->user();
        $notifications = $user->notifications;

        return ['data' => $notifications->map(function ($notification) {
        return NotificationResourceFactory::make($notification);
        })];
    }

    public function getUnreadNotifications()
    {
        $user = auth()->user();
        $notifications = $user->unreadNotifications;

        return ['data' => $notifications->map(function ($notification) {
            return NotificationResourceFactory::make($notification);
        })];
    }
}
