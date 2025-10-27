<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExchangeRateService
{
    private const CACHE_KEY_PREFIX = 'exchange_rates.';

    /**
     * Get exchange rate from source currency to target currency.
     * 
     * @throws \RuntimeException If unable to get exchange rate and no fallback available
     */
    public static function getRate(string $fromCurrency, string $toCurrency = 'USD'): float
    {
        $from = strtoupper($fromCurrency);
        $to = strtoupper($toCurrency);

        if ($from === $to) {
            return 1.0;
        }

        try {
            $baseCurrency = strtoupper(config('services.exchange_rate.base_currency', 'USD'));
            $rates = self::getRates($baseCurrency);

            if ($from === $baseCurrency) {
                return self::resolveRate($rates, $to);
            }

            if ($to === $baseCurrency) {
                $fromRate = self::resolveRate($rates, $from);
                return $fromRate > 0 ? 1 / $fromRate : 1.0;
            }

            $rateToBase = self::getRate($from, $baseCurrency);
            $rateFromBase = self::getRate($baseCurrency, $to);

            return round($rateToBase * $rateFromBase, 6);
        } catch (\Throwable $exception) {
            Log::error('exchange_rate.get_rate_failed', [
                'from' => $from,
                'to' => $to,
                'message' => $exception->getMessage(),
            ]);
            
            // Return hardcoded fallback rate
            $fallbackRates = self::getHardcodedRates();
            $fromRate = $fallbackRates[$from] ?? 1.0;
            $toRate = $fallbackRates[$to] ?? 1.0;
            
            if ($fromRate > 0 && $toRate > 0) {
                return round($toRate / $fromRate, 6);
            }
            
            // Last resort: return 1.0 to prevent complete failure
            Log::warning('exchange_rate.using_fallback_rate_1', [
                'from' => $from,
                'to' => $to,
            ]);
            return 1.0;
        }
    }

    /**
     * Convert amount from one currency to another.
     */
    public static function convert(float $amount, string $fromCurrency, string $toCurrency = 'USD'): float
    {
        $rate = self::getRate($fromCurrency, $toCurrency);
        return round($amount * $rate, 2);
    }

    /**
     * Retrieve exchange rates for a given base currency.
     */
    private static function getRates(string $baseCurrency): array
    {
        $cacheTtl = (int) config('services.exchange_rate.cache_ttl', 3600);
        $cacheKey = self::CACHE_KEY_PREFIX . $baseCurrency;

        return Cache::remember($cacheKey, $cacheTtl, function () use ($baseCurrency) {
            $rates = self::fetchRatesFromApi($baseCurrency);

            if (!empty($rates)) {
                return $rates;
            }

            Log::warning('exchange_rate.api_fallback', ['base' => $baseCurrency]);
            return self::getHardcodedRates();
        });
    }

    /**
     * Attempt to fetch live rates from configured API provider.
     */
    private static function fetchRatesFromApi(string $baseCurrency): array
    {
        $config = config('services.exchange_rate');
        $apiUrl = $config['api_url'] ?? null;
        $apiKey = $config['api_key'] ?? null;

        if (!$apiUrl || !$apiKey) {
            return [];
        }

        $url = $apiUrl . $apiKey . '/latest/' . $baseCurrency;
        $timeout = (int) ($config['timeout'] ?? 5);

        try {
            $response = Http::timeout($timeout)
                ->retry(2, 200)
                ->get($url);

            if (!$response->successful()) {
                Log::warning('exchange_rate.api_failed', [
                    'base' => $baseCurrency,
                    'status' => $response->status(),
                ]);
                return [];
            }

            $payload = $response->json();
            $rates = Arr::get($payload, 'conversion_rates', []);

            if (!is_array($rates) || empty($rates)) {
                return [];
            }

            $rates = array_change_key_case($rates, CASE_UPPER);
            $rates[$baseCurrency] = 1.0;

            return $rates;
        } catch (\Throwable $exception) {
            Log::warning('exchange_rate.api_exception', [
                'base' => $baseCurrency,
                'message' => $exception->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Resolve rate for a given currency with fallback to hardcoded rates.
     */
    private static function resolveRate(array $rates, string $currency): float
    {
        $normalized = strtoupper($currency);
        $rate = $rates[$normalized] ?? null;

        if ($rate !== null) {
            return (float) $rate;
        }

        $fallbackRates = self::getHardcodedRates();
        return (float) ($fallbackRates[$normalized] ?? 1.0);
    }

    /**
     * Get hardcoded exchange rates (USD as base currency).
     */
    public static function getHardcodedRates(): array
    {
        $configured = config('services.exchange_rate.fallback_rates', []);

        $defaults = [
            'USD' => 1.0,
            'VND' => 25000.0,
            'EUR' => 0.85,
            'GBP' => 0.73,
            'JPY' => 110.0,
            'CAD' => 1.25,
            'AUD' => 1.35,
            'CHF' => 0.92,
            'CNY' => 6.45,
            'INR' => 74.5,
            'BRL' => 5.2,
            'KRW' => 1180.0,
            'SGD' => 1.35,
            'THB' => 33.0,
            'MYR' => 4.2,
            'PHP' => 50.0,
            'IDR' => 14300.0,
        ];

        return array_change_key_case(array_merge($defaults, $configured), CASE_UPPER);
    }

    /**
     * Get list of supported currencies.
     */
    public static function getSupportedCurrencies(): array
    {
        return array_keys(self::getHardcodedRates());
    }

    /**
     * Check if a currency is supported.
     */
    public static function isSupported(string $currency): bool
    {
        return in_array(strtoupper($currency), self::getSupportedCurrencies(), true);
    }
}