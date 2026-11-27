<?php

namespace App\Notifications;

use App\Models\WalletTopup;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WalletTopupNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly WalletTopup $topup,
        private readonly string $event,
        private readonly ?string $reason = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $amount = number_format((float) $this->topup->amount_declared, 0, ',', '.').' VND';
        $code = $this->topup->code;

        return match ($this->event) {
            'transferred' => (new MailMessage)
                ->subject('ShopNest wallet top-up awaiting review')
                ->greeting('A customer reported a bank transfer')
                ->line("User: {$this->topup->user?->username} ({$this->topup->user?->email})")
                ->line("Transfer code: {$code}")
                ->line("Declared amount: {$amount}")
                ->line('Open the admin wallet top-up queue to verify the bank statement and approve or reject it.'),
            'approved' => (new MailMessage)
                ->subject('ShopNest wallet top-up approved')
                ->greeting('Your wallet top-up was approved')
                ->line("Transfer code: {$code}")
                ->line('Credited amount: '.number_format((float) ($this->topup->amount_received ?? $this->topup->amount_declared), 0, ',', '.').' VND')
                ->line('The amount is now available in your ShopNest wallet.'),
            'rejected' => (new MailMessage)
                ->subject('ShopNest wallet top-up rejected')
                ->greeting('Your wallet top-up could not be approved')
                ->line("Transfer code: {$code}")
                ->line('Declared amount: '.$amount)
                ->line('Reason: '.($this->reason ?? 'No reason provided.')),
            default => (new MailMessage)
                ->subject('ShopNest wallet top-up update')
                ->line("Transfer code: {$code}"),
        };
    }

    public function toArray(object $notifiable): array
    {
        return [
            'topup_id' => $this->topup->topup_id,
            'code' => $this->topup->code,
            'status' => $this->topup->status,
            'amount_declared' => (float) $this->topup->amount_declared,
            'amount_received' => $this->topup->amount_received !== null ? (float) $this->topup->amount_received : null,
            'event' => $this->event,
            'reason' => $this->reason,
        ];
    }
}
