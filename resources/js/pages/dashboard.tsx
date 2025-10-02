import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from '../lib/i18n';

export default function Dashboard() {
  const { post } = useForm();
  const { t } = useTranslation();

  const handleLogout = () => {
    post('/logout');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('Welcome to Dashboard')}</h1>
                <p>{t('You have successfully logged in!')}</p>
                
                <div className="flex gap-4">
                  <a 
                    href="/admin/dashboard" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    {t('Admin Dashboard')}
                  </a>
                  
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    {t('Logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
