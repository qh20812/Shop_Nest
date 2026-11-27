<?php

namespace App\Services;

use RuntimeException;

class VietQrService
{
    /**
     * Build a VietQR image URL for the configured receiving account.
     */
    public function buildUrl(float $amount, string $code): string
    {
        $bankBin = (string) config('wallet.vietqr.bank_bin');
        $accountNo = (string) config('wallet.vietqr.account_no');
        $accountName = (string) config('wallet.vietqr.account_name');
        $template = (string) config('wallet.vietqr.template', 'compact2');

        if ($bankBin === '' || $accountNo === '' || $accountName === '') {
            throw new RuntimeException('VietQR bank details are not configured.');
        }

        $base = sprintf(
            'https://img.vietqr.io/image/%s-%s-%s.png',
            rawurlencode($bankBin),
            rawurlencode($accountNo),
            rawurlencode($template),
        );

        $query = http_build_query([
            'amount' => (int) round($amount),
            'addInfo' => $code,
            'accountName' => $accountName,
        ], '', '&', PHP_QUERY_RFC3986);

        return $base.'?'.$query;
    }

    /**
     * @return array{bank_bin: string, bank_name: string|null, account_no: string, account_name: string, template: string, configured: bool}
     */
    public function bankInfo(): array
    {
        $bankBin = (string) config('wallet.vietqr.bank_bin');
        $accountNo = (string) config('wallet.vietqr.account_no');
        $accountName = (string) config('wallet.vietqr.account_name');
        $bankName = config('wallet.vietqr.bank_name');

        return [
            'bank_bin' => $bankBin,
            'bank_name' => $bankName !== null && $bankName !== '' ? (string) $bankName : null,
            'account_no' => $accountNo,
            'account_name' => $accountName,
            'template' => (string) config('wallet.vietqr.template', 'compact2'),
            'configured' => $bankBin !== '' && $accountNo !== '' && $accountName !== '',
        ];
    }
}
