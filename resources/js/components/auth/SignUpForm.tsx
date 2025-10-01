import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthButton from './AuthButton';
import AuthInput from './AuthInput';
import AuthSocialIcons from './AuthSocialIcons';

export default function SignUpForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register', {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="form-container sign-up">
      <form onSubmit={onSubmit}>
        <h1>Create Account</h1>
        <AuthSocialIcons baseHref="/auth/google" />
        <span>or use your email for registration</span>

        <AuthInput 
          type="email" 
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          required
        />
        {errors.email && (
          <div className="text-red-500 text-xs mt-1">{errors.email}</div>
        )}

        <AuthInput 
          type="password" 
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          required
        />
        {errors.password && (
          <div className="text-red-500 text-xs mt-1">{errors.password}</div>
        )}

        <AuthInput 
          type="password" 
          placeholder="Confirm Password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          required
        />

        <AuthButton 
          text={processing ? "Creating Account..." : "Sign Up"} 
          type="submit"
          disabled={processing}
        />
      </form>
    </div>
  );
}
