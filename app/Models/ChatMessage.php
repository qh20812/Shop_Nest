<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory;
    protected $primaryKey = 'chat_message_id';
    protected $fillable = [
        'chat_room_id',
        'sender_id',
        'content',
        'content_type',
        'attachment_url',
        'is_edited',
        'edited_at'
    ];
    public function sender():BelongsTo{
        return $this->belongsTo(User::class,'sender_id');
    }
}
