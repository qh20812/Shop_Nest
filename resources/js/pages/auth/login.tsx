import React from 'react';
import AuthContainer from '../../components/auth/AuthContainer';
import '../../../css/AuthPage.css';

interface LoginProps {
  canResetPassword?: boolean;
  status?: string;
}

export default function Login({ status }: LoginProps) {
  return (
    <div className="auth-page">
      {status && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          padding: '10px 20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          fontSize: '14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {status}
        </div>
      )}
      <AuthContainer defaultMode="signin" />
    </div>
  );
}
