<?php

namespace App\Http\Requests\Auth;

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
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
              'identifier' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
            'confirmPassword' => ['required', 'string', 'same:password'],
            'agreeToTerms' => ['required', 'accepted'],
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
                $identifier = $this->input('identifier');
            
            // Check if it's an email format
                if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
                // Validate as email - check if email already exists
                    if (\App\Models\User::where('email', $identifier)->exists()) {
                        $validator->errors()->add('identifier', 'Email đã được sử dụng.');
                }
                } else {
                    // It may be a phone number or a username
                    $phonePattern = '/^\+?[0-9]{9,15}$/';

                    if (preg_match($phonePattern, $identifier)) {
                        // Validate phone uniqueness
                        if (\App\Models\User::where('phone_number', $identifier)->exists()) {
                            $validator->errors()->add('identifier', 'Số điện thoại đã được sử dụng.');
                        }
                    } else {
                        // Validate as username - check format and uniqueness
                        if (!preg_match('/^[a-zA-Z0-9_]+$/', $identifier)) {
                            $validator->errors()->add('identifier', 'Tên người dùng không hợp lệ.');
                        } elseif (\App\Models\User::where('username', $identifier)->exists()) {
                            $validator->errors()->add('identifier', 'Tên người dùng đã tồn tại.');
                        }
                    }
            }
        });
    }
}
