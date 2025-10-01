import React from 'react';
import AuthContainer from '../../components/auth/AuthContainer';

export default function Register() {
  return (
    <div>
      <AuthContainer defaultMode="signup" />
    </div>
  );
}
