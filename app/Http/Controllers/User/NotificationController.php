<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notification;
use App\Enums\NotificationType;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tab = $request->get('tab', 'all'); // all | unread | promotion | order

        $query = Notification::query()->where('user_id', $user->id);

        if ($tab === 'unread') {
            $query->where('is_read', false);
        } elseif ($tab === 'promotion') {
            $query->where('type', NotificationType::CUSTOMER_PROMOTION->value);
        } elseif ($tab === 'order') {
            $query->whereIn('type', [
                NotificationType::CUSTOMER_ORDER_STATUS->value,
                NotificationType::CUSTOMER_DELIVERY_UPDATE->value,
            ]);
        }

        $notifications = $query->latest()->limit(100)->get()->map(function (Notification $n) {
            $icon = 'notifications';
            $color = 'gray';
            $category = 'general';

            switch ($n->type) {
                case NotificationType::CUSTOMER_PROMOTION:
                    $icon = 'campaign';
                    $color = 'primary';
                    $category = 'promotion';
                    break;
                case NotificationType::CUSTOMER_DELIVERY_UPDATE:
                    $icon = 'local_shipping';
                    $color = 'success';
                    $category = 'order';
                    break;
                case NotificationType::CUSTOMER_ORDER_STATUS:
                    $category = 'order';
                    // Heuristic for delivered / canceled based on content
                    $contentLower = mb_strtolower($n->content);
                    if (str_contains($contentLower, 'hủy') || str_contains($contentLower, 'cancel')) {
                        $icon = 'cancel';
                        $color = 'danger';
                    } elseif (str_contains($contentLower, 'giao') || str_contains($contentLower, 'delivered')) {
                        $icon = 'task_alt';
                        $color = 'success';
                    } else {
                        $icon = 'local_shipping';
                        $color = 'success';
                    }
                    break;
                case NotificationType::SYSTEM_MAINTENANCE:
                case NotificationType::SECURITY_ALERT:
                    $icon = 'policy';
                    $color = 'primary';
                    $category = 'system';
                    break;
                default:
                    // fallback based on role groups
                    $icon = 'notifications';
                    $color = 'primary';
                    $category = 'general';
            }

            return [
                'id' => $n->getKey(),
                'title' => $n->title,
                'content' => $n->content,
                'type' => $n->type->value,
                'type_label' => $n->type->label(),
                'category' => $category,
                'icon' => $icon,
                'color' => $color,
                'is_read' => $n->is_read,
                'action_url' => $n->action_url,
                'created_at' => $n->created_at?->diffForHumans(),
            ];
        });

        return Inertia::render('Customer/Notification/Index', [
            'notifications' => $notifications,
            'filters' => [ 'tab' => $tab ],
        ]);
    }

    public function markAllRead(Request $request)
    {
        $user = $request->user();
        Notification::where('user_id', $user->id)->where('is_read', false)->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
        return back();
    }

    public function markRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }
        $notification->markAsRead();
        return response()->json(['success' => true]);
    }
}
