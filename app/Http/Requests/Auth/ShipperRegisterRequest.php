<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class ShipperRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow guests to register as shippers
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Personal Information
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone_number' => [
                'required', 
                'string', 
                'regex:/^(\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-4|6-9])[0-9]{7}$/', // Vietnamese phone format
                'unique:users'
            ],
            
            // Shipper Information
            'id_card_number' => ['required', 'string', 'max:20'],
            'driver_license_number' => ['required', 'string', 'max:20'],
            'vehicle_type' => ['required', 'string', 'max:255'],
            'license_plate' => ['required', 'string', 'max:20'],
            
            // Document Uploads
            'id_card_front' => ['required', 'image', 'mimes:jpg,png,jpeg', 'max:2048'], // 2MB max
            'id_card_back' => ['required', 'image', 'mimes:jpg,png,jpeg', 'max:2048'],
            'driver_license_front' => ['required', 'image', 'mimes:jpg,png,jpeg', 'max:2048'],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'phone_number.regex' => 'The phone number must be a valid Vietnamese phone number.',
            'id_card_front.required' => 'Please upload a photo of the front of your ID card.',
            'id_card_back.required' => 'Please upload a photo of the back of your ID card.',
            'driver_license_front.required' => 'Please upload a photo of your driver\'s license.',
            '*.image' => 'The file must be an image.',
            '*.mimes' => 'Only JPG, PNG, and JPEG formats are allowed.',
            '*.max' => 'The file size must not exceed 2MB.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'id_card_number' => 'ID card number',
            'driver_license_number' => 'driver\'s license number',
            'vehicle_type' => 'vehicle type',
            'license_plate' => 'license plate',
            'id_card_front' => 'ID card front photo',
            'id_card_back' => 'ID card back photo',
            'driver_license_front' => 'driver\'s license photo',
        ];
    }
}
