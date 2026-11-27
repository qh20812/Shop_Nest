<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Clean up stale inventory reservations every hour
Schedule::command('reservations:cleanup --force')
    ->hourly()
    ->withoutOverlapping()
    ->runInBackground();

// Expire wallet top-up requests after their 24h bank-transfer window
Schedule::command('wallet-topups:expire')
    ->everyTenMinutes()
    ->withoutOverlapping()
    ->runInBackground();

// Xoá lịch sử chatbot quá thời hạn lưu trữ (mặc định 90 ngày).
Schedule::command('chatbot:prune')
    ->daily()
    ->withoutOverlapping()
    ->runInBackground();
