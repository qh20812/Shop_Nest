<?php

namespace App\Http\Controllers;

use App\Services\ExchangeRateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;

class CurrencyController extends Controller
{
    /**
     * Handle the incoming request to switch the active currency.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $supportedCurrencies = ExchangeRateService::getSupportedCurrencies();

        $validated = $request->validate([
            'currency' => ['required', 'string', Rule::in($supportedCurrencies)],
        ]);

        $currencyCode = strtoupper($validated['currency']);

        Session::put('currency', $currencyCode);

        return back();
    }
}
