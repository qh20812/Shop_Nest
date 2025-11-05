<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $authenticatedId = optional($request->user())->id;
        $partnerId = $this->resolvePartnerId($authenticatedId);
        $status = $this->resolvePartnerStatus($partnerId);

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'receiver_id' => $this->receiver_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'email' => $this->user->email,
            ]),
            'receiver' => $this->whenLoaded('receiver', fn () => [
                'id' => $this->receiver->id,
                'username' => $this->receiver->username,
                'first_name' => $this->receiver->first_name,
                'last_name' => $this->receiver->last_name,
                'email' => $this->receiver->email,
            ]),
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
            'partner_status' => $status['label'],
            'partner_last_activity_at' => $status['lastActivity'],
            'partner_id' => $partnerId,
        ];
    }

    /**
     * Resolve the conversation partner ID for the authenticated user.
     */
    private function resolvePartnerId(?int $authenticatedId): ?int
    {
        if ($authenticatedId === null) {
            return $this->receiver->id ?? $this->user->id ?? null;
        }

        if ((int) $this->user_id === $authenticatedId) {
            return $this->receiver->id ?? null;
        }

        if ((int) $this->receiver_id === $authenticatedId) {
            return $this->user->id ?? null;
        }

        return $this->receiver->id ?? $this->user->id ?? null;
    }

    /**
     * Resolve partner status metadata.
     *
     * @return array{label: string, lastActivity: string|null}
     */
    private function resolvePartnerStatus(?int $partnerId): array
    {
        if (! $partnerId) {
            return [
                'label' => 'Ngoại tuyến',
                'lastActivity' => null,
            ];
        }

        $timestamp = DB::table('sessions')->where('user_id', $partnerId)->max('last_activity');

        if (! $timestamp) {
            return [
                'label' => 'Ngoại tuyến',
                'lastActivity' => null,
            ];
        }

        $activity = Carbon::createFromTimestamp((int) $timestamp);

        return [
            'label' => $this->formatStatusLabel($activity),
            'lastActivity' => $activity->toIso8601String(),
        ];
    }

    private function formatStatusLabel(?Carbon $lastActivity): string
    {
        if (! $lastActivity) {
            return 'Ngoại tuyến';
        }

        $now = now();
        $diffInMinutes = $lastActivity->diffInMinutes($now);

        if ($diffInMinutes < 5) {
            return 'Đang trực tuyến';
        }

        if ($diffInMinutes < 60) {
            return 'Trực tuyến ' . $diffInMinutes . ' phút trước';
        }

        $diffInHours = $lastActivity->diffInHours($now);

        if ($diffInHours < 24) {
            return 'Trực tuyến ' . $diffInHours . ' giờ trước';
        }

        $diffInDays = $lastActivity->diffInDays($now);

        return $diffInDays === 1
            ? 'Trực tuyến 1 ngày trước'
            : 'Trực tuyến ' . $diffInDays . ' ngày trước';
    }
}
