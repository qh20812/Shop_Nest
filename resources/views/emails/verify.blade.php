<x-mail::message>
# {{ __('mail.verify.heading') }}

{{ __('mail.verify.greeting', ['name' => $name]) }}

{{ __('mail.verify.intro', ['email' => $email]) }}

<x-mail::button :url="$url">
{{ __('mail.verify.cta') }}
</x-mail::button>

{{ __('mail.verify.expiry', ['minutes' => $minutes]) }}

{{ __('mail.verify.resend') }}

{{ __('mail.verify.ignore') }}

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $url }}]({{ $url }})
</x-mail::subcopy>
</x-mail::message>
