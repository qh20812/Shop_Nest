<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Chuẩn hoá identifier trước khi validate để email/số điện thoại trùng nhau
     * ở dạng viết hoa hay có dấu cách vẫn bị phát hiện.
     */
    protected function prepareForValidation(): void
    {
        $identifier = trim((string) $this->input('identifier'));

        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $identifier = strtolower($identifier);
        } elseif (preg_match('/^\+?[0-9\s\-\.\(\)]{8,20}$/', $identifier)) {
            $identifier = preg_replace('/[\s\-\.\(\)]/', '', (string) $identifier);
        }

        $this->merge(['identifier' => $identifier]);
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
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/'],
            'confirmPassword' => ['required', 'string', 'same:password'],
            'agreeToTerms' => ['required', 'accepted'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'identifier.required' => 'Email, số điện thoại hoặc tên người dùng là bắt buộc.',
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.regex' => 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.',
            'confirmPassword.required' => 'Xác nhận mật khẩu là bắt buộc.',
            'confirmPassword.same' => 'Mật khẩu xác nhận không khớp.',
            'agreeToTerms.required' => 'Bạn phải đồng ý với Điều khoản Dịch vụ.',
            'agreeToTerms.accepted' => 'Bạn phải đồng ý với Điều khoản Dịch vụ.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $identifier = (string) $this->input('identifier');

            // Check if it's an email format
            if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
                $existing = User::whereRaw('LOWER(email) = ?', [$identifier])->first();

                if ($existing) {
                    $validator->errors()->add('identifier', $existing->provider === 'google'
                        ? 'Email này đã đăng ký bằng Google. Hãy đăng nhập bằng Google để tiếp tục.'
                        : 'Email đã được sử dụng.');
                }

                return;
            }

            $phonePattern = '/^\+?[0-9]{9,15}$/';

            if (preg_match($phonePattern, $identifier)) {
                // Số điện thoại được lưu ở dạng +84… nên phải chuẩn hoá trước khi so.
                if (User::where('phone_number', $this->normalizePhone($identifier))->exists()) {
                    $validator->errors()->add('identifier', 'Số điện thoại đã được sử dụng.');
                }

                return;
            }

            // Validate as username - check format and uniqueness
            if (! preg_match('/^[a-zA-Z0-9_.]+$/', $identifier)) {
                $validator->errors()->add('identifier', 'Tên người dùng không hợp lệ.');
            } elseif (User::where('username', $identifier)->exists()) {
                $validator->errors()->add('identifier', 'Tên người dùng đã tồn tại.');
            }
        });
    }

    private function normalizePhone(string $phone): string
    {
        if (str_starts_with($phone, '0')) {
            $phone = '+84'.substr($phone, 1);
        } elseif (! str_starts_with($phone, '+')) {
            $phone = '+'.$phone;
        }

        return $phone;
    }
}
