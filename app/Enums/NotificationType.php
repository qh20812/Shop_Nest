<?php

namespace App\Enums;

enum NotificationType: int
{
    // Admin notifications
    case ADMIN_SYSTEM_ALERT = 1;
    case ADMIN_USER_ACTIVITY = 2;
    case ADMIN_ORDER_MANAGEMENT = 3;
    case ADMIN_PRODUCT_REVIEW = 4;

    // Seller notifications
    case SELLER_ORDER_UPDATE = 5;
    case SELLER_PRODUCT_APPROVAL = 6;
    case SELLER_PAYMENT_RECEIVED = 7;
    case SELLER_REVIEW_RECEIVED = 8;

    // Shipper notifications
    case SHIPPER_ORDER_ASSIGNED = 9;
    case SHIPPER_DELIVERY_UPDATE = 10;
    case SHIPPER_PAYMENT_UPDATE = 11;

    // Customer notifications
    case CUSTOMER_ORDER_STATUS = 12;
    case CUSTOMER_PROMOTION = 13;
    case CUSTOMER_DELIVERY_UPDATE = 14;
    case CUSTOMER_REVIEW_REMINDER = 15;

    // Common notifications
    case SYSTEM_MAINTENANCE = 16;
    case SECURITY_ALERT = 17;

    // Admin workflow
    case ADMIN_USER_MODERATION = 18;
    case ADMIN_CATALOG_MANAGEMENT = 19;

    // Seller account
    case SELLER_ACCOUNT_STATUS = 20;

    /**
     * Get the label for the notification type
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN_SYSTEM_ALERT => 'System Alert',
            self::ADMIN_USER_ACTIVITY => 'User Activity',
            self::ADMIN_ORDER_MANAGEMENT => 'Order Management',
            self::ADMIN_PRODUCT_REVIEW => 'Product Review',

            self::SELLER_ORDER_UPDATE => 'Order Update',
            self::SELLER_PRODUCT_APPROVAL => 'Product Approval',
            self::SELLER_PAYMENT_RECEIVED => 'Payment Received',
            self::SELLER_REVIEW_RECEIVED => 'Review Received',

            self::SHIPPER_ORDER_ASSIGNED => 'Order Assigned',
            self::SHIPPER_DELIVERY_UPDATE => 'Delivery Update',
            self::SHIPPER_PAYMENT_UPDATE => 'Payment Update',

            self::CUSTOMER_ORDER_STATUS => 'Order Status',
            self::CUSTOMER_PROMOTION => 'Promotion',
            self::CUSTOMER_DELIVERY_UPDATE => 'Delivery Update',
            self::CUSTOMER_REVIEW_REMINDER => 'Review Reminder',

            self::SYSTEM_MAINTENANCE => 'System Maintenance',
            self::SECURITY_ALERT => 'Security Alert',
            self::ADMIN_USER_MODERATION => 'User Moderation',
            self::ADMIN_CATALOG_MANAGEMENT => 'Catalog Update',
            self::SELLER_ACCOUNT_STATUS => 'Account Status Update',
        };
    }

    /**
     * Get the description for the notification type
     */
    public function description(): string
    {
        return match ($this) {
            self::ADMIN_SYSTEM_ALERT => 'Critical system alerts and errors',
            self::ADMIN_USER_ACTIVITY => 'User registration and activity monitoring',
            self::ADMIN_ORDER_MANAGEMENT => 'Order processing and management updates',
            self::ADMIN_PRODUCT_REVIEW => 'Product approval and review notifications',

            self::SELLER_ORDER_UPDATE => 'New orders and order status changes',
            self::SELLER_PRODUCT_APPROVAL => 'Product listing approval status',
            self::SELLER_PAYMENT_RECEIVED => 'Payment confirmations and settlements',
            self::SELLER_REVIEW_RECEIVED => 'Customer reviews on products',

            self::SHIPPER_ORDER_ASSIGNED => 'New delivery assignments',
            self::SHIPPER_DELIVERY_UPDATE => 'Delivery status updates',
            self::SHIPPER_PAYMENT_UPDATE => 'Delivery payment notifications',

            self::CUSTOMER_ORDER_STATUS => 'Order placement and status updates',
            self::CUSTOMER_PROMOTION => 'Promotional offers and discounts',
            self::CUSTOMER_DELIVERY_UPDATE => 'Delivery tracking updates',
            self::CUSTOMER_REVIEW_REMINDER => 'Reminders to review purchased products',

            self::SYSTEM_MAINTENANCE => 'System maintenance and downtime notifications',
            self::SECURITY_ALERT => 'Security-related alerts and warnings',
            self::ADMIN_USER_MODERATION => 'Administrative actions related to user accounts',
            self::ADMIN_CATALOG_MANAGEMENT => 'Changes to catalog content such as categories or brands',
            self::SELLER_ACCOUNT_STATUS => 'Important updates about shop or seller account status',
        };
    }

    /**
     * Get notification types for a specific role
     */
    public static function forRole(string $role): array
    {
        return match ($role) {
            'admin' => [
                self::ADMIN_SYSTEM_ALERT,
                self::ADMIN_USER_ACTIVITY,
                self::ADMIN_ORDER_MANAGEMENT,
                self::ADMIN_PRODUCT_REVIEW,
                self::SYSTEM_MAINTENANCE,
                self::SECURITY_ALERT,
                self::ADMIN_USER_MODERATION,
                self::ADMIN_CATALOG_MANAGEMENT,
            ],
            'seller' => [
                self::SELLER_ORDER_UPDATE,
                self::SELLER_PRODUCT_APPROVAL,
                self::SELLER_PAYMENT_RECEIVED,
                self::SELLER_REVIEW_RECEIVED,
                self::SYSTEM_MAINTENANCE,
                self::SELLER_ACCOUNT_STATUS,
            ],
            'shipper' => [
                self::SHIPPER_ORDER_ASSIGNED,
                self::SHIPPER_DELIVERY_UPDATE,
                self::SHIPPER_PAYMENT_UPDATE,
                self::SYSTEM_MAINTENANCE,
            ],
            'customer' => [
                self::CUSTOMER_ORDER_STATUS,
                self::CUSTOMER_PROMOTION,
                self::CUSTOMER_DELIVERY_UPDATE,
                self::CUSTOMER_REVIEW_REMINDER,
                self::SYSTEM_MAINTENANCE,
                self::SECURITY_ALERT,
            ],
            default => [],
        };
    }

    /**
     * Get the role this notification type belongs to
     */
    public function getRole(): string
    {
        return match ($this) {
            self::ADMIN_SYSTEM_ALERT,
            self::ADMIN_USER_ACTIVITY,
            self::ADMIN_ORDER_MANAGEMENT,
            self::ADMIN_PRODUCT_REVIEW => 'admin',

            self::SELLER_ORDER_UPDATE,
            self::SELLER_PRODUCT_APPROVAL,
            self::SELLER_PAYMENT_RECEIVED,
            self::SELLER_REVIEW_RECEIVED => 'seller',

            self::SHIPPER_ORDER_ASSIGNED,
            self::SHIPPER_DELIVERY_UPDATE,
            self::SHIPPER_PAYMENT_UPDATE => 'shipper',

            self::CUSTOMER_ORDER_STATUS,
            self::CUSTOMER_PROMOTION,
            self::CUSTOMER_DELIVERY_UPDATE,
            self::CUSTOMER_REVIEW_REMINDER => 'customer',

            self::SYSTEM_MAINTENANCE,
            self::SECURITY_ALERT => 'all',
            self::ADMIN_USER_MODERATION,
            self::ADMIN_CATALOG_MANAGEMENT => 'admin',
            self::SELLER_ACCOUNT_STATUS => 'seller',
        };
    }

    /**
     * Get all notification types as array
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value', 'name');
    }

    /**
     * Get all notification types with labels
     */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }
        return $options;
    }
}
