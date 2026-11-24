<x-mail::message>
# {{ __('mail.google_linked.heading') }}

{{ __('mail.google_linked.greeting', ['name' => $name]) }}

{{ __('mail.google_linked.intro', ['email' => $email]) }}

@if ($passwordWasReset)
{{ __('mail.google_linked.password_reset_note') }}
@endif

<x-mail::button :url="$url">
{{ __('mail.google_linked.cta') }}
</x-mail::button>

**{{ __('mail.google_linked.security_title') }}**

{{ __('mail.google_linked.security_line') }}

{{ __('mail.google_linked.closing') }}

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $url }}]({{ $url }})
</x-mail::subcopy>
</x-mail::message>
