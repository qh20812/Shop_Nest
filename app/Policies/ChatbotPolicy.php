<?php

namespace App\Policies;

use App\Models\User;

class ChatbotPolicy
{
    public function access(User $user): bool
    {
        return $user->isAdmin()
            || $user->isSeller()
            || $user->isShipper()
            || $user->isCustomer();
    }
}
