<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration updates the NotificationType enum values.
     * No database structure changes are needed as enum casting is handled in the model.
     * The enum values have been expanded to support role-based notifications:
     *
     * - Admin: ADMIN_SYSTEM_ALERT, ADMIN_USER_ACTIVITY, ADMIN_ORDER_MANAGEMENT, ADMIN_PRODUCT_REVIEW
     * - Seller: SELLER_ORDER_UPDATE, SELLER_PRODUCT_APPROVAL, SELLER_PAYMENT_RECEIVED, SELLER_REVIEW_RECEIVED
     * - Shipper: SHIPPER_ORDER_ASSIGNED, SHIPPER_DELIVERY_UPDATE, SHIPPER_PAYMENT_UPDATE
     * - Customer: CUSTOMER_ORDER_STATUS, CUSTOMER_PROMOTION, CUSTOMER_DELIVERY_UPDATE, CUSTOMER_REVIEW_REMINDER
     * - Common: SYSTEM_MAINTENANCE, SECURITY_ALERT
     */
    public function up(): void
    {
        // No database changes needed - enum casting is handled in Notification model
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No database changes to reverse
    }
};
