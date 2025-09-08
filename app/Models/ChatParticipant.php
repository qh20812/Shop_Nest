<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatParticipant extends Model
{
    use HasFactory;
    protected $primaryKey = 'chat_participant_id';
    public $timestamps = false;
    protected $fillable = [
        'chat_room_id',
        'user_id',
        'joined_at',
        'left_at'
    ];
}
