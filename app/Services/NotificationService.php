<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send notification to a specific user.
     */
    public static function sendToUser(
        User|int|null $user,
        string $title,
        string $content,
        NotificationType $type,
        ?Model $notifiable = null,
        ?string $actionUrl = null
    ): ?Notification {
        $userModel = $user instanceof User
            ? $user
            : ($user ? User::find($user) : null);

        if (!$userModel) {
            Log::warning('Attempted to send notification to missing user', [
                'title' => $title,
                'type' => $type->name,
            ]);

            return null;
        }

        return $userModel->notifications()->create([
            'title' => $title,
            'content' => $content,
            'type' => $type->value,
            'notifiable_type' => $notifiable ? get_class($notifiable) : null,
            'notifiable_id' => $notifiable?->getKey(),
            'action_url' => $actionUrl,
        ]);
    }

    /**
     * Send notification to all users with a specific role.
     */
    public static function sendToRole(
        string $role,
        string $title,
        string $content,
        NotificationType $type,
        ?Model $notifiable = null,
        ?string $actionUrl = null
    ): int {
        $normalizedRole = strtolower($role);

        $users = match ($normalizedRole) {
            'all' => User::all(),
            default => self::usersForRole($normalizedRole),
        };

        if ($users->isEmpty()) {
            Log::notice('No users found for notification role', [
                'role' => $normalizedRole,
                'title' => $title,
            ]);

            return 0;
        }

        return $users->reduce(function (int $count, User $user) use ($title, $content, $type, $notifiable, $actionUrl) {
            self::sendToUser($user, $title, $content, $type, $notifiable, $actionUrl);

            return $count + 1;
        }, 0);
    }

    /**
     * Send notification to multiple users.
     */
    public static function sendToUsers(
        array $users,
        string $title,
        string $content,
        NotificationType $type,
        ?Model $notifiable = null,
        ?string $actionUrl = null
    ): int {
        $count = 0;

        foreach ($users as $user) {
            $result = self::sendToUser($user, $title, $content, $type, $notifiable, $actionUrl);

            if ($result instanceof Notification) {
                $count++;
            }
        }

        return $count;
    }

    /**
     * Send system maintenance notification to all users
     */
    public static function sendMaintenanceNotification(string $message): int
    {
        return self::sendToRole('all', 'System Maintenance', $message, NotificationType::SYSTEM_MAINTENANCE);
    }

    /**
     * Send security alert to relevant roles
     */
    public static function sendSecurityAlert(string $message): int
    {
        $count = 0;
        $count += self::sendToRole('admin', 'Security Alert', $message, NotificationType::SECURITY_ALERT);
        $count += self::sendToRole('customer', 'Security Alert', $message, NotificationType::SECURITY_ALERT);
        return $count;
    }

    /**
     * Send order update to seller
     */
    public static function sendOrderUpdateToSeller(User $seller, Model $order, string $message): ?Notification
    {
        return self::sendToUser(
            $seller,
            'New Order',
            $message,
            NotificationType::SELLER_ORDER_UPDATE,
            $order,
            route('seller.orders.show', $order->id)
        );
    }

    /**
     * Send delivery update to customer
     */
    public static function sendDeliveryUpdateToCustomer(User $customer, Model $order, string $message): ?Notification
    {
        return self::sendToUser(
            $customer,
            'Delivery Update',
            $message,
            NotificationType::CUSTOMER_DELIVERY_UPDATE,
            $order,
            route('user.orders.show', $order->id)
        );
    }

    /**
     * Send order assigned to shipper
     */
    public static function sendOrderAssignedToShipper(User $shipper, Model $order, string $message): ?Notification
    {
        return self::sendToUser(
            $shipper,
            'New Delivery Assignment',
            $message,
            NotificationType::SHIPPER_ORDER_ASSIGNED,
            $order,
            route('shipper.deliveries.show', $order->id)
        );
    }

    /**
     * Send product approval notification to seller
     */
    public static function sendProductApprovalToSeller(User $seller, Model $product, bool $approved): ?Notification
    {
        $status = $approved ? 'approved' : 'rejected';
        $message = "Your product '{$product->name}' has been {$status}.";

        return self::sendToUser(
            $seller,
            'Product Approval Update',
            $message,
            NotificationType::SELLER_PRODUCT_APPROVAL,
            $product,
            route('seller.products.show', $product->id)
        );
    }

    /**
     * Send promotion to customers
     */
    public static function sendPromotionToCustomers(string $title, string $message, ?string $actionUrl = null): int
    {
        return self::sendToRole('customer', $title, $message, NotificationType::CUSTOMER_PROMOTION, null, $actionUrl);
    }

    /**
     * Resolve users by role slug.
     */
    protected static function usersForRole(string $role): Collection
    {
        $normalized = strtolower($role);

        $roleModel = Role::all()->first(function (Role $candidate) use ($normalized) {
            $translations = $candidate->getTranslations('name');

            foreach ($translations as $value) {
                if (strtolower($value) === $normalized) {
                    return true;
                }
            }

            return false;
        });

        if (!$roleModel) {
            return collect();
        }

        return $roleModel->users;
    }
}