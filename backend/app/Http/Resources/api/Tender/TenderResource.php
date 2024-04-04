<?php

namespace App\Http\Resources\api\Tender;

use App\Http\Resources\api\File\FileCollection;
use App\Http\Resources\api\File\FileResource;
use App\Models\File;
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
            'start_price' => $this->start_price,
            'status' => $this->status,
            'files' => FileResource::collection($this->whenLoaded('files')),
            'categoryId' => $this->category_id,
            'customerId' => $this->customer_id,
            'executorId' => $this->executor_id,
            'untilDate' => $this->until_date,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at
        ];
    }
}
