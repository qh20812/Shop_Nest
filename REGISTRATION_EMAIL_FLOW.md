# Registration Email Flow Documentation

## Overview
The Shop_Nest application has two distinct registration flows, each sending different welcome emails:

## 1. Manual Registration Flow
**Controller**: `App\Http\Controllers\Auth\RegisteredUserController`
**Email**: `App\Mail\WelcomeEmail`
**Template**: `resources/views/emails/welcome.blade.php`

### Process:
1. User fills registration form with email and password
2. System generates unique username automatically
3. User account is created with `provider = 'manual'`
4. `Registered` event is fired
5. **Standard welcome email is sent** with:
   - Welcome message
   - Username information
   - Login and profile completion links
   - General onboarding information

## 2. Google OAuth Registration Flow
**Controller**: `App\Http\Controllers\Auth\GoogleController`
**Email**: `App\Mail\WelcomeGoogleUserMail`
**Template**: `resources/views/emails/welcome_google_user.blade.php`

### Process:
1. User clicks "Login with Google"
2. Google OAuth authentication
3. System checks if user exists by Google ID or email
4. If new user:
   - Account is created with `provider = 'google'`
   - Random 32-character password is generated
   - `Registered` event is fired
   - **Google-specific welcome email is sent** with:
     - Personalized welcome with Google name
     - Account credentials (email, username)
     - **Temporary password for account access**
     - Security instructions to change password
     - Password change instructions

## Key Differences

### Standard Welcome Email:
- Simple welcome message
- No password information (user created their own)
- Focus on platform features and getting started

### Google Welcome Email:
- Includes temporary password for security
- Emphasizes password change requirement
- More detailed security instructions
- Account credentials summary

## Email Sending Configuration
- Both emails are sent **immediately** (not queued)
- Proper error handling and logging
- No duplicate emails (each flow sends only its specific email)
- Comprehensive logging for debugging

## Testing Commands
```bash
# Test standard welcome email
php artisan app:test-email

# Test Google welcome email
php artisan app:test-google-welcome-email
```

## Security Notes
- Google users receive a secure random password
- Users are encouraged to change the temporary password
- All password generation uses Laravel's secure random string generation
- Email verification is automatically handled for Google users