<x-mail::message>
# {{ __('mail.reset.heading') }}

{{ __('mail.reset.greeting', ['name' => $name]) }}

{{ __('mail.reset.intro', ['email' => $email]) }}

<x-mail::button :url="$url">
{{ __('mail.reset.cta') }}
</x-mail::button>

{{ __('mail.reset.expiry', ['minutes' => $minutes]) }}

{{ __('mail.reset.google_note') }}

{{ __('mail.reset.ignore') }}

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $url }}]({{ $url }})
</x-mail::subcopy>
</x-mail::message>
