<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Bản queue của ResetPassword mặc định.
 *
 * Nội dung do App\Providers\MailServiceProvider::boot() quyết định qua
 * ResetPassword::toMailUsing().
 */
class ResetPasswordNotification extends ResetPassword implements ShouldQueue {}
