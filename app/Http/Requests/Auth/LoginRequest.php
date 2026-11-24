<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'identifier.required' => 'Email, số điện thoại hoặc tên người dùng là bắt buộc.',
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.regex' => 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $identifier = $this->string('identifier')->trim()->value();
        $password = (string) $this->input('password');
        $remember = $this->boolean('remember');

        $field = $this->determineIdentifierField($identifier);

        // Normalize identifier based on field
        if ($field === 'phone_number') {
            // Remove spaces, convert leading 0 to +84, ensure starts with +
            $identifier = str_replace(' ', '', $identifier);
            if (str_starts_with($identifier, '0')) {
                $identifier = '+84'.substr($identifier, 1);
            }
            if (! str_starts_with($identifier, '+')) {
                $identifier = '+'.$identifier;
            }
        } elseif ($field === 'username') {
            $identifier = strtolower($identifier);
        } elseif ($field === 'email') {
            $identifier = strtolower($identifier);
        }

        if (! Auth::attempt([$field => $identifier, 'password' => $password], $remember)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'identifier' => $this->failureMessage($field, $identifier),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Gợi ý đúng hướng khi tài khoản được tạo bằng Google (không có mật khẩu).
     */
    private function failureMessage(string $field, string $identifier): string
    {
        if ($field === 'email') {
            $user = User::whereRaw('LOWER(email) = ?', [$identifier])->first();

            if ($user?->provider === 'google') {
                return 'Tài khoản này đăng nhập bằng Google. Hãy chọn “Tiếp tục với Google”, hoặc dùng Quên mật khẩu nếu bạn muốn đặt mật khẩu.';
            }
        }

        return __('auth.failed');
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'identifier' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return $this->string('identifier')
            ->lower()
            ->append('|'.$this->ip())
            ->transliterate()
            ->value();
    }

    /**
     * Determine which field the identifier refers to.
     */
    protected function determineIdentifierField(string $identifier): string
    {
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            return 'email';
        }

        // Simple phone check: digits with optional leading +, length 8-15
        $normalized = preg_replace('/[\s\-\.\(\)]/', '', $identifier);
        if (preg_match('/^\+?\d{8,15}$/', $normalized)) {
            return 'phone_number';
        }

        return 'username';
    }
}
