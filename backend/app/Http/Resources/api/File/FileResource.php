<?php

namespace App\Http\Resources\api\File;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
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
            'userId' => $this->user_id,
            'url' => $this->url,
        ];
    }
}
