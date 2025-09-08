<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatRoom extends Model
{
    use HasFactory;
    protected $primaryKey='chat_room_id';
    protected $fillable=[
        'room_name',
        'type',
        'is_active'
    ];
    public function messages():HasMany{
        return $this->hasMany(ChatMessage::class,'chat_room_id');
    }
    public function participants():HasMany{
        return $this->hasMany(ChatParticipant::class,'chat_room_id');
    }
}
