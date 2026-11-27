<x-mail::message>
# {{ $heading }}

{{ $greeting }}

{{ $intro }}

<x-mail::table>
| {{ __('mail.order.table.summary_field') }} | {{ __('mail.order.table.summary_value') }} |
|:--|:--|
@foreach ($summary as $label => $value)
| **{{ $label }}** | {{ $value }} |
@endforeach
</x-mail::table>

<x-mail::button :url="$url">
{{ __('mail.order.cta') }}
</x-mail::button>

{{ __('mail.order.closing') }}

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $url }}]({{ $url }})
</x-mail::subcopy>
</x-mail::message>
