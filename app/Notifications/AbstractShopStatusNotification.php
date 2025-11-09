<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

abstract class AbstractShopStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected array $context = [])
    {
    }

    public function via(mixed $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $mail = (new MailMessage())
            ->subject($this->subjectLine())
            ->greeting('Hello ' . ($notifiable->first_name ?: $notifiable->username) . ',');

        foreach ($this->messageLines() as $line) {
            $mail->line($line);
        }

        $mail->line('If you have any questions, please contact our support team.');

        return $mail;
    }

    public function toArray(mixed $notifiable): array
    {
        return [
            'type' => static::class,
            'subject' => $this->subjectLine(),
            'context' => $this->context,
        ];
    }

    abstract protected function subjectLine(): string;

    /**
     * @return array<int, string>
     */
    abstract protected function messageLines(): array;
}
