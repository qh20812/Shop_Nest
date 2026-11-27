<x-mail::message>
# {{ __('mail.google_welcome.heading') }}

{{ __('mail.google_welcome.greeting', ['name' => $name]) }}

{{ __('mail.google_welcome.intro', ['email' => $email]) }}

**{{ __('mail.google_welcome.signin_title') }}**

{{ __('mail.google_welcome.signin_line') }}

<x-mail::button :url="$url">
{{ __('mail.google_welcome.cta') }}
</x-mail::button>

{{ __('mail.google_welcome.password_tip', ['email' => $email]) }}

{{ __('mail.google_welcome.closing') }}

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $url }}]({{ $url }})
</x-mail::subcopy>
</x-mail::message>
