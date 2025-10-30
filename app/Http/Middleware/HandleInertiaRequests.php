<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use App\Services\ExchangeRateService;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

    $availableRates = ExchangeRateService::getHardcodedRates();
    $availableCodes = array_keys($availableRates);

    $defaultCurrency = App::getLocale() === 'vi' ? 'VND' : 'USD';
    $sessionCurrency = strtoupper((string) $request->session()->get('currency', $defaultCurrency));
        if (!in_array($sessionCurrency, $availableCodes, true)) {
            $sessionCurrency = $availableCodes[0] ?? 'VND';
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'first_name' => $request->user()->first_name,
                    'last_name' => $request->user()->last_name,
                    'email' => $request->user()->email,
                    'username' => $request->user()->username,
                    'avatar' => $request->user()->avatar,
                    'avatar_url' => $request->user()->avatar_url,
                    'roles' => $request->user()->loadMissing('roles')->roles->map(fn ($role) => ['name' => $role->name]),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => App::getLocale(),
            'translations' => $this->getTranslations(),
            'currency' => [
                'code' => $sessionCurrency,
                'rates' => $availableRates,
                'available' => $availableCodes,
            ],
        ];
    }

    /**
     * Get translations for current locale
     *
     * @return array
     */
    private function getTranslations(): array
    {
        $locale = App::getLocale();
        $path = lang_path("{$locale}.json");
        
        if (File::exists($path)) {
            return json_decode(File::get($path), true) ?? [];
        }
        
        return [];
    }
}
