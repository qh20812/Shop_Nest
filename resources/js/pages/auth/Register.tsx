import React from 'react';
import AuthContainer from '../../components/auth/AuthContainer';

export default function Register() {
  return (
    <AuthContainer 
      defaultActive={true}
    />
  );
}

// Không sử dụng layout
Register.layout = (page: React.ReactElement) => page;