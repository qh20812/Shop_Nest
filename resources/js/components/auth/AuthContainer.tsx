import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import TogglePanel from './TogglePanel';
import '../../../css/AuthPage.css';

interface AuthContainerProps {
  defaultMode?: 'signin' | 'signup';
}

export default function AuthContainer({ defaultMode = 'signin' }: AuthContainerProps) {
  const [isActive, setIsActive] = useState(defaultMode === 'signup');

  const handleToggle = (mode: 'signin' | 'signup') => {
    setIsActive(mode === 'signup');
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <SignUpForm />
      <SignInForm />
      <div className="toggle-container">
        <div className="toggle">
          <TogglePanel 
            type="left" 
            title="Welcome Back!"
            description="Enter your personal details to use all of site features"
            buttonText="Sign In"
            onClick={() => handleToggle('signin')}
          />
          <TogglePanel 
            type="right" 
            title="Hello, Friend!"
            description="Register with your personal details to use all of site features"
            buttonText="Sign Up"
            onClick={() => handleToggle('signup')}
          />
        </div>
      </div>
    </div>
  );
}
