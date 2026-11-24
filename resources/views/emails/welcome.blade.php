<x-mail::message>
# {{ __('mail.welcome.heading') }}

{{ __('mail.welcome.greeting', ['name' => $name]) }}

{{ __('mail.welcome.intro', ['email' => $email]) }}

**{{ __('mail.welcome.next_title') }}**

- {{ __('mail.welcome.step_profile') }}
- {{ __('mail.welcome.step_shopping') }}
- {{ __('mail.welcome.step_seller') }}

<x-mail::button :url="$url">
{{ __('mail.welcome.cta') }}
</x-mail::button>

{{ __('mail.welcome.username_tip', ['username' => $username]) }}

{{ __('mail.welcome.closing') }}

{{ __('mail.salutation') }}<br>
{{ config('app.name') }}

<x-mail::subcopy>
{{ __('mail.subcopy.trouble') }}
[{{ $url }}]({{ $url }})
</x-mail::subcopy>
</x-mail::message>
