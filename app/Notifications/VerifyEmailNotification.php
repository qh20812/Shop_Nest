<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Bản queue của VerifyEmail mặc định: mail xác thực được đẩy vào queue thay vì
 * gửi đồng bộ trong request đăng ký (SMTP chậm/lỗi không làm hỏng request).
 *
 * Nội dung do App\Providers\MailServiceProvider::boot() quyết định qua
 * VerifyEmail::toMailUsing().
 */
class VerifyEmailNotification extends VerifyEmail implements ShouldQueue {}
