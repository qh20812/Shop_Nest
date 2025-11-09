<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Display a listing of the user's notifications.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $roleName = $user->role_name;

        // If user has no role, return empty result
        if (!$roleName) {
            return response()->json([
                'notifications' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 20,
                    'total' => 0,
                ],
                'unread_count' => 0,
            ]);
        }

        $query = $user->notifications()->forRole($roleName)->with('notifiable');

        // Filter by read status
        if ($request->has('read')) {
            $query->where('is_read', $request->boolean('read'));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->integer('type'));
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $notifications = $query->latest()->paginate($perPage);

        // Get unread count for user's role
        $unreadCount = $user->notifications()->forRole($roleName)->unread()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        // Ensure user owns the notification
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Mark multiple notifications as read
     */
    public function markMultipleAsRead(Request $request): JsonResponse
    {
        $request->validate([
            'notification_ids' => 'required|array',
            'notification_ids.*' => 'integer|exists:notifications,notification_id',
        ]);

        $request->user()->notifications()
            ->whereIn('notification_id', $request->notification_ids)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->notifications()
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['success' => true]);
    }

    /**
     * Delete a notification
     */
    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        // Ensure user owns the notification
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Delete multiple notifications
     */
    public function destroyMultiple(Request $request): JsonResponse
    {
        $request->validate([
            'notification_ids' => 'required|array',
            'notification_ids.*' => 'integer|exists:notifications,notification_id',
        ]);

        $request->user()->notifications()
            ->whereIn('notification_id', $request->notification_ids)
            ->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Get unread count
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();
        $roleName = $user->role_name;

        // If user has no role, return 0
        if (!$roleName) {
            return response()->json(['unread_count' => 0]);
        }

        $count = $user->notifications()->forRole($roleName)->unread()->count();

        return response()->json(['unread_count' => $count]);
    }
}
