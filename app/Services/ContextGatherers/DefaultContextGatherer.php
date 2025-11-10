<?php

namespace App\Services\ContextGatherers;

use App\Models\User;

class DefaultContextGatherer implements ContextGathererInterface
{
    public function gather(?User $user = null): array
    {
        if (!$user) {
            return [];
        }

        return [
            'profile' => [
                'username' => $user->username,
                'email_verified' => (bool) $user->email_verified_at,
                'has_orders' => $user->orders()->exists(),
            ],
        ];
    }
}