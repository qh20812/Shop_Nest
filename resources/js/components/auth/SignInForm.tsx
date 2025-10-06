import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthButton from './AuthButton';
import AuthSocialIcons from './AuthSocialIcons';
import AuthInput from './AuthInput';

export default function SignInForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="form-container sign-in">
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <AuthSocialIcons baseHref="/auth/google" />
        <span>or use your email password</span>
        
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

        

        <a href="/forgot-password" style={{ fontSize: '13px', textDecoration: 'none', margin: '15px 0 10px', color: '#333'}}>
          Forgot Your Password?
        </a>

        <AuthButton 
          text={processing ? "Signing In..." : "Sign In"} 
          type="submit"
          disabled={processing}
        />
      </form>
    </div>
  );
}
