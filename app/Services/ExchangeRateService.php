<?php

namespace App\Services;

class ExchangeRateService
{
    /**
     * Get exchange rate from source currency to target currency.
     * 
     * @param string $fromCurrency Source currency code (e.g., 'VND')
     * @param string $toCurrency Target currency code (e.g., 'USD')
     * @return float Exchange rate
     */
    public static function getRate(string $fromCurrency, string $toCurrency = 'USD'): float
    {
        // If currencies are the same, rate is 1
        if ($fromCurrency === $toCurrency) {
            return 1.0;
        }

        // TODO: Integrate with real exchange rate API
        // Examples:
        // - https://api.exchangerate-api.com/v4/latest/USD
        // - https://openexchangerates.org/api/latest.json
        // - https://api.fixer.io/latest
        
        // For now, return hardcoded rates for demonstration
        $rates = self::getHardcodedRates();
        
        if ($toCurrency === 'USD') {
            // Converting from other currency to USD
            return isset($rates[$fromCurrency]) ? (1 / $rates[$fromCurrency]) : 1.0;
        } elseif ($fromCurrency === 'USD') {
            // Converting from USD to other currency
            return $rates[$toCurrency] ?? 1.0;
        } else {
            // Converting between two non-USD currencies
            $fromToUsd = 1 / ($rates[$fromCurrency] ?? 1.0);
            $usdToTarget = $rates[$toCurrency] ?? 1.0;
            return $fromToUsd * $usdToTarget;
        }
    }

    /**
     * Convert amount from one currency to another.
     * 
     * @param float $amount Amount to convert
     * @param string $fromCurrency Source currency
     * @param string $toCurrency Target currency
     * @return float Converted amount
     */
    public static function convert(float $amount, string $fromCurrency, string $toCurrency = 'USD'): float
    {
        $rate = self::getRate($fromCurrency, $toCurrency);
        return round($amount * $rate, 2);
    }

    /**
     * Get hardcoded exchange rates (USD as base currency).
     * In production, this would be replaced with API calls.
     * 
     * @return array Exchange rates where 1 USD = X units
     */
    public static function getHardcodedRates(): array
    {
        return [
            'USD' => 1.0,       // Base currency
            'VND' => 25000.0,   // 1 USD = 25,000 VND
            'EUR' => 0.85,      // 1 USD = 0.85 EUR
            'GBP' => 0.73,      // 1 USD = 0.73 GBP
            'JPY' => 110.0,     // 1 USD = 110 JPY
            'CAD' => 1.25,      // 1 USD = 1.25 CAD
            'AUD' => 1.35,      // 1 USD = 1.35 AUD
            'CHF' => 0.92,      // 1 USD = 0.92 CHF
            'CNY' => 6.45,      // 1 USD = 6.45 CNY
            'INR' => 74.5,      // 1 USD = 74.5 INR
            'BRL' => 5.2,       // 1 USD = 5.2 BRL
            'KRW' => 1180.0,    // 1 USD = 1,180 KRW
            'SGD' => 1.35,      // 1 USD = 1.35 SGD
            'THB' => 33.0,      // 1 USD = 33 THB
            'MYR' => 4.2,       // 1 USD = 4.2 MYR
            'PHP' => 50.0,      // 1 USD = 50 PHP
            'IDR' => 14300.0,   // 1 USD = 14,300 IDR
        ];
    }

    /**
     * Get list of supported currencies.
     * 
     * @return array Supported currency codes
     */
    public static function getSupportedCurrencies(): array
    {
        return array_merge(['USD'], array_keys(self::getHardcodedRates()));
    }

    /**
     * Check if a currency is supported.
     * 
     * @param string $currency Currency code to check
     * @return bool True if supported
     */
    public static function isSupported(string $currency): bool
    {
        return in_array($currency, self::getSupportedCurrencies());
    }
}