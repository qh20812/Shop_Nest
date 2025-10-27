<?php

namespace App\Policies;

use App\Models\Promotion;
use App\Models\User;

class PromotionPolicy
{
    public function view(User $user, Promotion $promotion): bool
    {
        return $user->isAdmin() || (int) $promotion->seller_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isSeller();
    }

    public function update(User $user, Promotion $promotion): bool
    {
        return $user->isAdmin() || ($user->isSeller() && (int) $promotion->seller_id === $user->id);
    }

    public function delete(User $user, Promotion $promotion): bool
    {
        return $user->isAdmin() || ($user->isSeller() && (int) $promotion->seller_id === $user->id);
    }
}
