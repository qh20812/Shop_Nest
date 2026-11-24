<x-mail::message>
# {{ $heading }}

{{ $greeting }}

@foreach ($lines as $line)
{{ $line }}

@endforeach

@if ($actionUrl && $actionText)
<x-mail::button :url="$actionUrl">
{{ $actionText }}
</x-mail::button>

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $actionUrl }}]({{ $actionUrl }})
</x-mail::subcopy>
@endif

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}
</x-mail::message>
