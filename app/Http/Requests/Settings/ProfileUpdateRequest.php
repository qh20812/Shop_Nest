<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function authorize(): bool{
        return true;
    }
    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'regex:/^[a-zA-Z0-9_-]+$/',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'first_name' => ['required', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone_number' => [
                'nullable',
                'string',
                'regex:/^(0[3|5|7|8|9])+([0-9]{8})\b$/',
            ],
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,gif',
                'max:2048', // 2MB max
            ],
            'remove_avatar' => ['nullable', 'boolean'],
        ];
    }
}
