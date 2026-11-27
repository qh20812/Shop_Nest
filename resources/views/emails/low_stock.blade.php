<x-mail::message>
# {{ __('mail.low_stock.heading') }}

{{ $greeting }}

{{ __('mail.low_stock.intro') }}

{{ __('mail.low_stock.product', ['product' => $productName]) }}

{{ __('mail.low_stock.variant', ['variant' => $variantName]) }}

{{ __('mail.low_stock.sku', ['sku' => $sku]) }}

{{ __('mail.low_stock.quantity', ['quantity' => $quantity, 'threshold' => $threshold]) }}

<x-mail::button :url="$url">
{{ __('mail.low_stock.cta') }}
</x-mail::button>

{{ __('mail.low_stock.note') }}

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $url }}]({{ $url }})
</x-mail::subcopy>
</x-mail::message>
