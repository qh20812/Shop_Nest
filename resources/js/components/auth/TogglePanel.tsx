import React from 'react';

interface TogglePanelProps {
  isActive: boolean;
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

export default function TogglePanel({ isActive, onSignInClick, onSignUpClick }: TogglePanelProps) {
  return (
    <div className={`bg-gradient-to-r from-indigo-400 to-indigo-600 h-full text-white relative -left-full w-[200%] transition-all duration-600 ease-in-out ${
      isActive ? 'translate-x-1/4' : 'translate-x-0'
    }`}>
      {/* Toggle Left Panel */}
      <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-600 ease-in-out ${
        isActive ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-sm leading-5 tracking-wide my-5">
          Enter your personal details to use all of site features
        </p>
        <button
          onClick={onSignInClick}
          className="bg-transparent border border-white text-white text-sm py-3 px-11 rounded-lg font-semibold tracking-wider uppercase mt-3 cursor-pointer hover:bg-white hover:text-indigo-600 transition-all"
        >
          Sign In
        </button>
      </div>

      {/* Toggle Right Panel */}
      <div className={`absolute right-0 w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-600 ease-in-out ${
        isActive ? 'translate-x-full' : 'translate-x-0'
      }`}>
        <h1 className="text-2xl font-bold mb-4">Hello, Friend!</h1>
        <p className="text-sm leading-5 tracking-wide my-5">
          Register with your personal details to use all of site features
        </p>
        <button
          onClick={onSignUpClick}
          className="bg-transparent border border-white text-white text-sm py-3 px-11 rounded-lg font-semibold tracking-wider uppercase mt-3 cursor-pointer hover:bg-white hover:text-indigo-600 transition-all"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}