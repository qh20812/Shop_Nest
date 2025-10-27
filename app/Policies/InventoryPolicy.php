<?php

namespace App\Policies;

use App\Models\ProductVariant;
use App\Models\User;

class InventoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function viewReports(User $user): bool
    {
        return $user->isAdmin();
    }

    public function manageInventory(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, ProductVariant $variant): bool
    {
        return $user->isAdmin();
    }
}
