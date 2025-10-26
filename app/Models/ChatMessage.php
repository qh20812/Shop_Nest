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
        'role_context',
        'assistant_api',
        'content',
        'assistant_content',
        'context_snapshot',
        'assistant_metadata',
        'response_latency_ms',
        'content_type',
        'attachment_url',
        'is_edited',
        'edited_at'
    ];

    protected $casts = [
        'context_snapshot' => 'array',
        'assistant_metadata' => 'array',
        'is_edited' => 'boolean',
        'edited_at' => 'datetime',
    ];
    public function sender():BelongsTo{
        return $this->belongsTo(User::class,'sender_id');
    }
}
