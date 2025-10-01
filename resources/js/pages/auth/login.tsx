import React from 'react';
import AuthContainer from '../../components/auth/AuthContainer';

export default function Login() {
  return (
    <div>
      <AuthContainer defaultMode="signin" />
    </div>
  );
}
