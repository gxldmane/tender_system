<?php

namespace App\Http\Resources\api\Tender;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TenderResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'startPrice' => $this->start_price,
            'currentPrice' => $this->current_price,
            'categoryId' => $this->category_id,
            'customerId' => $this->customer_id,
            'executorId' => $this->executor_id,
            'untilDate' => $this->until_date,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at
        ];
    }
}
