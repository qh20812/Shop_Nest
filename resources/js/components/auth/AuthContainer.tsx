import { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import TogglePanel from './TogglePanel';
import '../../../css/AuthPage.css';
import { useTranslation } from '../../lib/i18n';

interface AuthContainerProps {
  defaultMode?: 'signin' | 'signup';
}

export default function AuthContainer({ defaultMode = 'signin' }: AuthContainerProps) {
  const [isActive, setIsActive] = useState(defaultMode === 'signup');

  const handleToggle = (mode: 'signin' | 'signup') => {
    setIsActive(mode === 'signup');
  };
  const { t } = useTranslation();

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <SignUpForm />
      <SignInForm />
      <div className="toggle-container">
        <div className="toggle">
          <TogglePanel
            type="left"
            title={t("Welcome Back!")}
            description={t("Enter your personal details to use all of site features")}
            buttonText={t("Sign In")}
            onClick={() => handleToggle('signin')}
          />
          <TogglePanel
            type="right"
            title={t("Hello, Friend!")}
            description={t("Register with your personal details to use all of site features")}
            buttonText={t("Sign Up")}
            onClick={() => handleToggle('signup')}
          />
        </div>
      </div>
    </div>
  );
}
