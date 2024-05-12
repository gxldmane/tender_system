<?php

namespace App\Http\Resources\api\Notification;


class NotificationResourceFactory
{
    public static function make($notification)
    {
        $userRole = auth()->user()->role;

        switch ($userRole) {
            case 'customer':
                return new TenderNotificationResource($notification);
                break;
            case 'executor':
                return new BidNotificationResource($notification);
                break;
        }
        return null;
    }
}
