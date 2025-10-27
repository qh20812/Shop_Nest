import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                light: '#f6f6f9',
                'light-2': '#ffffff',
                primary: '#1976D2',
                'light-primary': '#CFE8FF',
                grey: '#eee',
                'dark-grey': '#AAAAAA',
                dark: '#363949',
                danger: '#D32F2F',
                'light-danger': '#FECDD3',
                warning: '#FBC02D',
                'light-warning': '#FFF2C6',
                success: '#388E3C',
                'light-success': '#BBF7D0',
            },
            boxShadow: {
                'navbar': '0 2px 4px rgba(0, 0, 0, 0.1)',
                'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
                'cart': '0 8px 24px rgba(0, 0, 0, 0.15)',
                'search': '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
        },
    },

    plugins: [forms],
};