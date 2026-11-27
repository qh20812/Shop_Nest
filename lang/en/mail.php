<?php

return [
    'salutation' => 'Regards,',

    'footer' => [
        'rights' => 'All rights reserved.',
        'support' => 'Need help? Reply to this email and the ShopNest team will help.',
        'reason' => 'You received this email because it relates to your ShopNest account.',
    ],

    'subcopy' => [
        'trouble' => 'If the button above does not work, copy the following link into your browser:',
    ],

    'welcome' => [
        'subject' => 'Welcome to ShopNest',
        'heading' => 'Welcome to ShopNest',
        'greeting' => 'Hello :name,',
        'intro' => ':email has been verified. Your ShopNest account is ready to use.',
        'next_title' => 'You can start right away',
        'step_profile' => '**Complete your profile** - add your name, phone number and photo.',
        'step_shopping' => '**Start shopping** - browse products from approved shops.',
        'step_seller' => '**Open a shop** - register as a seller if you want to sell.',
        'cta' => 'Go to ShopNest',
        'username_tip' => 'Your username is :username - you can change it in Settings → Profile.',
        'closing' => 'Happy shopping!',
    ],

    'google_welcome' => [
        'subject' => 'Your ShopNest account is ready',
        'heading' => 'Welcome to ShopNest',
        'greeting' => 'Hello :name,',
        'intro' => 'Your ShopNest account was created with Google using :email.',
        'signin_title' => 'How to sign in',
        'signin_line' => 'On the sign-in page, choose **Sign in with Google**. This account has no separate password.',
        'password_tip' => 'If you want a password to sign in with your email, use **Forgot password** with :email.',
        'cta' => 'Sign in with Google',
        'closing' => 'Happy shopping!',
    ],

    'google_linked' => [
        'subject' => 'Your ShopNest account is linked to Google',
        'heading' => 'Your account is linked to Google',
        'greeting' => 'Hello :name,',
        'intro' => 'The ShopNest account for :email was just linked to Google sign-in.',
        'password_reset_note' => 'Because this email was not verified before linking, the previous password has been **disabled**. Use “Forgot password” if you want to set a new one.',
        'cta' => 'Sign in with Google',
        'security_title' => 'Not you?',
        'security_line' => 'Reset your password right away and contact support so we can check the account.',
        'closing' => 'Thanks for using ShopNest.',
    ],

    'verify' => [
        'subject' => 'Verify your ShopNest email',
        'heading' => 'Verify your email',
        'greeting' => 'Hello :name,',
        'intro' => 'Click the button below to verify :email and activate your ShopNest account.',
        'cta' => 'Verify email',
        'expiry' => 'This link expires in :minutes minutes.',
        'resend' => 'If the link has expired, sign in and choose “Resend verification email” on the verification page.',
        'ignore' => 'If you did not create this account, you can safely ignore this email.',
    ],

    'reset' => [
        'subject' => 'Reset your ShopNest password',
        'heading' => 'Reset your password',
        'greeting' => 'Hello :name,',
        'intro' => 'We received a password reset request for :email.',
        'cta' => 'Reset password',
        'expiry' => 'This link expires in :minutes minutes.',
        'ignore' => 'If you did not request a reset, no action is needed - your current password still works.',
        'google_note' => 'Signed up with Google? You can set a password here, or keep using Google sign-in.',
    ],

    'shop' => [
        'greeting' => 'Hello :name,',
        'cta' => 'Manage shop',
        'approved' => [
            'subject' => 'Your shop has been approved',
            'heading' => 'Your shop is live',
            'line_1' => 'Your shop **:shop** has been approved and is now visible to customers.',
            'line_2' => 'You can start listing products and processing orders right away.',
        ],
        'rejected' => [
            'subject' => 'Update on your shop application',
            'heading' => 'Your shop application was not approved',
            'line_1' => 'Unfortunately, your application for **:shop** was not approved.',
            'reason' => '**Reason:** :reason',
            'line_2' => 'You can update your shop details and submit the application again.',
        ],
        'suspended' => [
            'subject' => 'Your shop has been suspended',
            'heading' => 'Your shop has been suspended',
            'line_1' => 'Your shop **:shop** has been suspended.',
            'reason' => '**Reason:** :reason',
            'until' => 'The suspension ends on **:date**.',
            'line_2' => 'Please resolve the issue and contact support if you need clarification.',
        ],
        'reactivated' => [
            'subject' => 'Your shop is active again',
            'heading' => 'Your shop is active again',
            'line_1' => 'Your shop **:shop** has been reactivated and is visible to customers.',
            'line_2' => 'Thank you for working with us to resolve the issue.',
        ],
    ],

    'low_stock' => [
        'subject' => 'Low stock: :product',
        'heading' => 'Low stock warning',
        'unknown_product' => 'Unknown product',
        'greeting' => 'Hello :name,',
        'intro' => 'A product in your shop dropped below the low-stock threshold.',
        'product' => '**Product:** :product',
        'variant' => '**Variant:** :variant',
        'sku' => '**SKU:** :sku',
        'quantity' => '**Remaining:** :quantity (threshold :threshold)',
        'cta' => 'Update inventory',
        'note' => 'You receive this warning once per low-stock event; it resets when you restock the item.',
    ],

    'order' => [
        'greeting' => 'Hello :name,',
        'cta' => 'View order',
        'closing' => 'Thank you for shopping at ShopNest.',
        'table' => [
            'summary_field' => 'Detail',
            'summary_value' => 'Value',
            'order_number' => 'Order',
            'placed_at' => 'Placed on',
            'total' => 'Total',
            'payment' => 'Method',
            'status' => 'Status',
        ],
        'payment_statuses' => [
            'unpaid' => 'Unpaid',
            'paid' => 'Paid',
            'failed' => 'Payment failed',
            'refunded' => 'Refunded',
        ],
        'payment_methods' => [
            'cod' => 'Cash on delivery',
            'stripe' => 'Card (Stripe)',
            'wallet' => 'ShopNest wallet',
        ],
        'statuses' => [
            'pending_confirmation' => 'Pending confirmation',
            'processing' => 'Processing',
            'pending_assignment' => 'Awaiting dispatch',
            'assigned_to_shipper' => 'Handed to carrier',
            'delivering' => 'Out for delivery',
            'delivered' => 'Delivered',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'returned' => 'Returned',
        ],
        'events' => [
            'placed' => [
                'subject' => 'Order :number received',
                'heading' => 'We received your order',
                'intro' => 'Thank you for your order. We registered order **:number** and will confirm it shortly.',
            ],
            'processing' => [
                'subject' => 'Order :number is being prepared',
                'heading' => 'Your order is being prepared',
                'intro' => 'The shop confirmed order **:number** and is preparing your items.',
            ],
            'delivering' => [
                'subject' => 'Order :number is on the way',
                'heading' => 'Your order is on the way',
                'intro' => 'Order **:number** has been handed to the carrier.',
            ],
            'delivered' => [
                'subject' => 'Order :number has been delivered',
                'heading' => 'Your order was delivered',
                'intro' => 'Order **:number** was delivered. Please check the items and confirm receipt to complete the order.',
            ],
            'completed' => [
                'subject' => 'Order :number is complete',
                'heading' => 'Your order is complete',
                'intro' => 'Order **:number** is complete. Thank you for shopping at ShopNest.',
            ],
            'cancelled' => [
                'subject' => 'Order :number was cancelled',
                'heading' => 'Your order was cancelled',
                'intro' => 'Order **:number** was cancelled. If you already paid, the refund follows ShopNest policy.',
            ],
            'returned' => [
                'subject' => 'Order :number was returned',
                'heading' => 'Return recorded',
                'intro' => 'Return for order **:number** has been recorded. We will process your return request.',
            ],
            'refunded' => [
                'subject' => 'Refund issued for order :number',
                'heading' => 'Refund issued',
                'intro' => 'The payment for order **:number** has been refunded. Timing depends on your bank or wallet.',
            ],
        ],
    ],
];
