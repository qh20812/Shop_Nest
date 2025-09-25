import React from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, Lock, Github, Facebook } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface SignInFormProps {
  status?: string;
  canResetPassword?: boolean;
}

export default function SignInForm({ status, canResetPassword = false }: SignInFormProps) {
  const { t } = useTranslation();
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
    <div className="bg-white flex items-center justify-center flex-col px-10 h-full">
      <form onSubmit={onSubmit} className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold mb-6">{t('Sign In')}</h1>
        
        {/* Social Icons */}
        <div className="flex gap-3 mb-4">
          <a href="#" className="border border-gray-300 rounded-full inline-flex justify-center items-center w-10 h-10 hover:bg-gray-100 transition-colors">
            <Mail className="w-4 h-4 text-gray-600" />
          </a>
          <a href="#" className="border border-gray-300 rounded-full inline-flex justify-center items-center w-10 h-10 hover:bg-gray-100 transition-colors">
            <Facebook className="w-4 h-4 text-gray-600" />
          </a>
          <a href="#" className="border border-gray-300 rounded-full inline-flex justify-center items-center w-10 h-10 hover:bg-gray-100 transition-colors">
            <Github className="w-4 h-4 text-gray-600" />
          </a>
          <a href="#" className="border border-gray-300 rounded-full inline-flex justify-center items-center w-10 h-10 hover:bg-gray-100 transition-colors">
            <Lock className="w-4 h-4 text-gray-600" />
          </a>
        </div>
        
        <span className="text-xs text-gray-600 mb-4">{t('or use your email password')}</span>
        
        {status && (
          <div className="mb-4 text-sm font-medium text-green-600">
            {status}
          </div>
        )}
        
        {/* Email Input */}
        <div className="w-full mb-2">
          <input
            type="email"
            placeholder={t('Email')}
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="bg-gray-200 border-0 my-2 px-4 py-3 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        
        {/* Password Input */}
        <div className="w-full mb-2">
          <input
            type="password"
            placeholder={t('Password')}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="bg-gray-200 border-0 my-2 px-4 py-3 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        
        {/* Remember Me */}
        <div className="w-full flex items-center mb-2">
          <input
            type="checkbox"
            id="remember"
            checked={data.remember}
            onChange={(e) => setData('remember', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="remember" className="text-sm text-gray-600">
            {t('Remember me')}
          </label>
        </div>
        
        {canResetPassword && (
          <a 
            href="/forgot-password" 
            className="text-gray-700 text-sm no-underline my-4 hover:text-indigo-600 transition-colors"
          >
            {t('Forget Your Password?')}
          </a>
        )}
        
        <button
          type="submit"
          disabled={processing}
          className="bg-indigo-600 text-white text-sm py-3 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-3 cursor-pointer hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? `${t('Sign In')}...` : t('Sign In')}
        </button>
      </form>
    </div>
  );
}