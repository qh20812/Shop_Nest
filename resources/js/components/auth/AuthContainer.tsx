import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import TogglePanel from './TogglePanel';

interface AuthContainerProps {
  defaultActive?: boolean;
  status?: string;
  canResetPassword?: boolean;
}

export default function AuthContainer({ 
  defaultActive = false, 
  status, 
  canResetPassword = false 
}: AuthContainerProps) {
  const [isActive, setIsActive] = useState(defaultActive);

  const handleSignInClick = () => {
    setIsActive(false);
  };

  const handleSignUpClick = () => {
    setIsActive(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-indigo-300">
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[480px] ${
          isActive ? 'active' : ''
        }`}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {/* Sign Up Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-600 ease-in-out ${
          isActive 
            ? 'translate-x-full opacity-100 z-10' 
            : 'opacity-0 z-0'
        }`}>
          <SignUpForm />
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-600 ease-in-out z-20 ${
          isActive ? 'translate-x-full' : ''
        }`}>
          <SignInForm status={status} canResetPassword={canResetPassword} />
        </div>

        {/* Toggle Panel */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-[1000] ${
          isActive 
            ? '-translate-x-full rounded-r-[150px] rounded-bl-[100px]' 
            : 'rounded-l-[150px] rounded-br-[100px]'
        }`}>
          <TogglePanel 
            isActive={isActive}
            onSignInClick={handleSignInClick}
            onSignUpClick={handleSignUpClick}
          />
        </div>
      </div>
    </div>
  );
}