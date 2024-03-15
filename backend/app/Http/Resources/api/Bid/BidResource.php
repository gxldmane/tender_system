<?php

namespace App\Http\Resources\api\Bid;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BidResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tenderId' => $this->tender_id,
            'companyId' => $this->company_id,
            'userId' => $this->user_id,
            'price' => $this->price,
            'status' => $this->status,
            'createdAt' => $this->created_at,
        ];
    }
}
