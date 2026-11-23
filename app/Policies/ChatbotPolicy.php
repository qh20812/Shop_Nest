<?php

namespace App\Policies;

use App\Models\User;

class ChatbotPolicy
{
    public function access(User $user): bool
    {
        $user->loadMissing('roles');

        return $user->roles->contains(
            fn ($role) => in_array($role->getTranslation('name', 'en'), ['Admin', 'Seller', 'Shipper', 'Customer'], true)
        );
    }
}
