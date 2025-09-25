import React from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from '../../lib/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale } = useTranslation();

  const switchLanguage = (newLocale: string) => {
    router.post('/language', { locale: newLocale }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-600" />
        <div className="flex space-x-1">
          <button
            onClick={() => switchLanguage('vi')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              locale === 'vi'
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
            }`}
          >
            Tiếng Việt
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => switchLanguage('en')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              locale === 'en'
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}