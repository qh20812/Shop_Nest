<?php

namespace App\Http\Controllers;

use App\Services\ExchangeRateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;

class CurrencyController extends Controller
{
    /**
     * Handle the incoming request to switch the active currency.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        try {
            $supportedCurrencies = ExchangeRateService::getSupportedCurrencies();

            if (empty($supportedCurrencies)) {
                Log::error('No supported currencies available');
                return back()->withErrors(['currency' => 'Currency switching is currently unavailable']);
            }

            $validated = $request->validate([
                'currency' => ['required', 'string', 'size:3', Rule::in($supportedCurrencies)],
            ]);

            $currencyCode = strtoupper($validated['currency']);

            Session::put('currency', $currencyCode);

            Log::info('Currency switched', [
                'user_id' => Auth::check() ? Auth::id() : null,
                'currency' => $currencyCode,
                'ip' => $request->ip()
            ]);

            return back()->with('success', 'Currency updated successfully');

        } catch (\Exception $e) {
            Log::error('Currency switch failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::check() ? Auth::id() : null,
                'ip' => $request->ip()
            ]);

            return back()->withErrors(['currency' => 'Failed to update currency']);
        }
    }
}
