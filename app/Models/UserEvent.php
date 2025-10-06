<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserEvent extends Model
{
    // Disable updated_at since we only track when events happen
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'session_id',
        'event_type',
        'event_category',
        'event_data',
        'ip_address',
        'user_agent',
        'referrer',
        'url',
    ];

    protected $casts = [
        'event_data' => 'array',
        'created_at' => 'datetime',
    ];

    // Event type constants
    const EVENT_PAGE_VIEW = 'page_view';
    const EVENT_PRODUCT_VIEW = 'product_view';
    const EVENT_ADD_TO_CART = 'add_to_cart';
    const EVENT_REMOVE_FROM_CART = 'remove_from_cart';
    const EVENT_CHECKOUT_START = 'checkout_start';
    const EVENT_CHECKOUT_COMPLETE = 'checkout_complete';
    const EVENT_PURCHASE = 'purchase';
    const EVENT_LOGIN = 'login';
    const EVENT_REGISTER = 'register';
    const EVENT_LOGOUT = 'logout';
    const EVENT_SEARCH = 'search';
    const EVENT_FILTER = 'filter';
    const EVENT_WISHLIST_ADD = 'wishlist_add';

    // Event category constants
    const CATEGORY_USER = 'user';
    const CATEGORY_PRODUCT = 'product';
    const CATEGORY_ORDER = 'order';
    const CATEGORY_NAVIGATION = 'navigation';
    const CATEGORY_GENERAL = 'general';

    /**
     * Get the user who performed this event.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Static method to track events easily.
     */
    public static function track(
        string $eventType,
        ?int $userId = null,
        ?string $sessionId = null,
        array $eventData = [],
        string $category = self::CATEGORY_GENERAL
    ): self {
        return self::create([
            'user_id' => $userId,
            'session_id' => $sessionId ?? session()->getId(),
            'event_type' => $eventType,
            'event_category' => $category,
            'event_data' => $eventData,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'referrer' => request()->headers->get('referer'),
            'url' => request()->fullUrl(),
        ]);
    }
}
