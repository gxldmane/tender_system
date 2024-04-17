<?php

namespace App\Http\Resources\api\Notification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TenderNotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'tenderClosed',
            'userId' => $this->notifiable_id,
            'tenderId' => $this->data['tender_id'],
            'message' => $this->data['message'],
            'readAt' => $this->read_at
        ];
    }
}
