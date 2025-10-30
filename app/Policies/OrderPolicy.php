<?php

namespace App\Policies;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        return $user->id === $order->customer_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can cancel the order.
     */
    public function cancel(User $user, Order $order): bool
    {
        return $this->isOwner($user, $order)
            && in_array($this->status($order), [
                OrderStatus::PENDING_CONFIRMATION,
                OrderStatus::PROCESSING,
                OrderStatus::PENDING_ASSIGNMENT,
            ], true);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        return $this->isOwner($user, $order)
            && in_array($this->status($order), [
                OrderStatus::PENDING_CONFIRMATION,
                OrderStatus::PROCESSING,
            ], true);
    }

    public function reorder(User $user, Order $order): bool
    {
        return $this->isOwner($user, $order)
            && in_array($this->status($order), [
                OrderStatus::DELIVERED,
                OrderStatus::COMPLETED,
                OrderStatus::CANCELLED,
            ], true);
    }

    public function requestReturn(User $user, Order $order): bool
    {
        return $this->isOwner($user, $order)
            && in_array($this->status($order), [
                OrderStatus::DELIVERED,
                OrderStatus::COMPLETED,
            ], true);
    }

    public function track(User $user, Order $order): bool
    {
        return $this->isOwner($user, $order)
            && $order->tracking_number
            && $order->shipping_provider;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Order $order): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Order $order): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Order $order): bool
    {
        return false;
    }

    protected function isOwner(User $user, Order $order): bool
    {
        return $user->id === $order->customer_id;
    }

    protected function status(Order $order): OrderStatus
    {
        return $order->status instanceof OrderStatus
            ? $order->status
            : OrderStatus::from($order->status);
    }
}
