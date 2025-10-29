<?php

namespace App\Policies;

use App\Models\AnalyticsReport;
use App\Models\User;

class AnalyticsReportPolicy
{
    /**
     * Determine whether the user can view any analytics reports.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view a specific analytics report.
     */
    public function view(User $user, AnalyticsReport $report): bool
    {
        return $user->isAdmin() || $report->created_by === $user->id;
    }

    /**
     * Determine whether the user can create analytics reports.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the analytics report.
     */
    public function update(User $user, AnalyticsReport $report): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the analytics report.
     */
    public function delete(User $user, AnalyticsReport $report): bool
    {
        return $user->isAdmin();
    }
}
