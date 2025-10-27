<?php

namespace App\Listeners\Auth;

use App\Services\CartService;
use Illuminate\Auth\Events\Login;

class MergeGuestCart
{
    public function __construct(private CartService $cartService)
    {
    }

    public function handle(Login $event): void
    {
        $user = $event->user;

        if ($user) {
            $this->cartService->mergeGuestCartIntoUser($user);
        }
    }
}
