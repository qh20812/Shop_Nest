<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
    Route::get('/chat/conversations', [ChatController::class, 'index']);
    Route::get('/chat/users/search', [ChatController::class, 'searchUsers']);
    Route::post('/chat/conversations', [ChatController::class, 'createConversation']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);
});