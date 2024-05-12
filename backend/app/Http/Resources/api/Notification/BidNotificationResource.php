<?php

namespace App\Http\Resources\api\Notification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BidNotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'userId' => $this->notifiable_id,
            'bidId' => $this->data['bid_id'],
            'message' => $this->data['message'],
            'readAt' => $this->read_at
        ];
    }
}
