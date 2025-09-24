import React from 'react';
import AuthContainer from '../../components/auth/AuthContainer';

interface LoginProps {
  status?: string;
  canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  return (
    <AuthContainer 
      status={status} 
      canResetPassword={canResetPassword} 
    />
  );
}

// Không sử dụng layout
Login.layout = (page: React.ReactElement) => page;
