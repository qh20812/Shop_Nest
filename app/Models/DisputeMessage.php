<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisputeMessage extends Model
{
    use HasFactory;
    protected $primaryKey = 'dispute_message_id';
    protected $fillable = [
        'dispute_id',
        'sender_id',
        'content',
        'attachment_url',
        'is_admin_message'
    ];
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
