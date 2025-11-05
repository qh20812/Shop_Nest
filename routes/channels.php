<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversation}', function ($user, Conversation $conversation) {
    if (! $user) {
        return false;
    }

    return (int) $conversation->user_id === (int) $user->id
        || (int) $conversation->receiver_id === (int) $user->id;
});
