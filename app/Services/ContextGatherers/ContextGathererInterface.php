<?php

namespace App\Services\ContextGatherers;

use App\Models\User;

interface ContextGathererInterface
{
    public function gather(?User $user = null): array;
}