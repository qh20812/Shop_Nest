<?php

namespace Tests\Unit\Wallet;

use App\Services\VietQrService;
use RuntimeException;
use Tests\TestCase;

class VietQrServiceTest extends TestCase
{
    public function test_builds_vietqr_url_with_configured_bank_details(): void
    {
        config([
            'wallet.vietqr.bank_bin' => '970407',
            'wallet.vietqr.account_no' => '23712299999999',
            'wallet.vietqr.account_name' => 'HUYNH NGOC QUI',
            'wallet.vietqr.template' => 'compact2',
        ]);

        $url = app(VietQrService::class)->buildUrl(100000, 'ABCDEF');

        $this->assertSame(
            'https://img.vietqr.io/image/970407-23712299999999-compact2.png?amount=100000&addInfo=ABCDEF&accountName=HUYNH%20NGOC%20QUI',
            $url
        );
    }

    public function test_throws_when_bank_details_are_missing(): void
    {
        config([
            'wallet.vietqr.bank_bin' => '',
            'wallet.vietqr.account_no' => '',
            'wallet.vietqr.account_name' => '',
        ]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('VietQR bank details are not configured.');

        app(VietQrService::class)->buildUrl(100000, 'ABCDEF');
    }
}
