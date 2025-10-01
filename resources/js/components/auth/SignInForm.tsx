import React from 'react';
import AuthButton from './AuthButton';
import AuthSocialIcons from './AuthSocialIcons';
import AuthInput from './AuthInput';

export default function SignInForm() {
  return (
    <div className="form-container sign-in">
      <form>
        <h1>Sign In</h1>
        <AuthSocialIcons baseHref="/auth/google" />
        <span>or use your email password</span>
        <AuthInput type='email' placeholder='Email/Username/Phone number' />
        <AuthInput type='password' placeholder='Password' />
        <AuthButton text="Sign In" type="button" />
        <a href="#">Forget Your Password?</a>
      </form>
    </div>
  );
}
