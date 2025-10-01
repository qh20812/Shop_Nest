import React from 'react';
import AuthButton from './AuthButton';
import AuthInput from './AuthInput';
import AuthSocialIcons from './AuthSocialIcons';
export default function SignUpForm() {
  return (
    <div className="form-container sign-up">
      <form>
        <h1>Create Account</h1>
        <AuthSocialIcons baseHref="/auth/google" />
        <span>or use your email for registration</span>

        <AuthInput type="text" placeholder='Username' />
        <AuthInput type="number" placeholder='Phone number' />
        <AuthInput type="password" placeholder='Password' />
        <AuthInput type="password" placeholder='Confirm Password' />
        <AuthButton text="Sign Up" type="button" />
      </form>
    </div>
  );
}
