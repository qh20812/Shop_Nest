<?php

namespace App\Providers;

use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\ServiceProvider;

/**
 * Thay nội dung mặc định (tiếng Anh, generic) của 2 notification framework
 * bằng mailable markdown của ShopNest: đúng ngôn ngữ người nhận, có logo,
 * nêu rõ hạn của liên kết và hướng dẫn gửi lại.
 */
class MailServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new VerifyEmailMail($notifiable, $url))->to($notifiable->email);
        });

        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new ResetPasswordMail($notifiable, $url))->to($notifiable->getEmailForPasswordReset());
        });
    }
}
