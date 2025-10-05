<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class NotOldPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = Auth::user();
        
        // Kiểm tra nếu mật khẩu mới trùng với mật khẩu hiện tại
        if ($user && Hash::check($value, $user->password)) {
            $fail(__('New password cannot be the same as current password'));
        }
    }
}
