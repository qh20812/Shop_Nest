<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'first_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'phone_number' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^(?!-)[0-9+\-\s()]*$/',
                Rule::unique('users', 'phone_number')->ignore($userId),
            ],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['nullable', 'date', 'before:18 years ago'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'date_of_birth' => 'date of birth',
        ];
    }

    public function messages(): array
    {
        return [
            'phone_number.regex' => 'The phone number format is invalid.',
            'email.unique' => 'This email address is already in use.',
            'phone_number.unique' => 'This phone number is already in use.',
            'date_of_birth.before' => 'You must be at least 18 years old.',
            'avatar.image' => 'The avatar must be a valid image file.',
            'avatar.max' => 'The avatar must not exceed 2MB in size.',
        ];
    }
}
