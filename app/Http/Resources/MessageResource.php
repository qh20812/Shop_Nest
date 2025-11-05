<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'content' => $this->content,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'sender' => $this->whenLoaded('sender', fn () => [
                'id' => $this->sender->id,
                'username' => $this->sender->username,
                'first_name' => $this->sender->first_name,
                'last_name' => $this->sender->last_name,
                'email' => $this->sender->email,
            ]),
        ];
    }
}
