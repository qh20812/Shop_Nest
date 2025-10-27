import React from 'react';
import AuthContainer from '../../Components/auth/AuthContainer';
import '../../../css/AuthPage.css';

export default function Register() {
  return (
    <div className="auth-page">
      <AuthContainer defaultMode="signup" />
    </div>
  );
}
