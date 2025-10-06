import React from 'react';
import '../../../css/AuthPage.css';

interface ForgotPasswordProps {
  status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
  return (
    <div className="auth-page">
      {/* Hiển thị thông báo trạng thái (thành công / lỗi) */}
      {status && (
        <div
          style={{
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {status}
        </div>
      )}

      {/* Hộp chứa nội dung */}
      <div className="container">
        <div className="form-container" style={{ width: '100%' }}>
          <form method="POST" action="/forgot-password">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a password reset link</p>

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              autoFocus
            />

            <button type="submit">Send Reset Link</button>

            <a href="/login">Back to Login</a>
          </form>
        </div>
      </div>
    </div>
  );
}
