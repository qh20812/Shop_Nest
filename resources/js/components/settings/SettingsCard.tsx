import React from 'react';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function SettingsCard({ title, description, children, footer }: SettingsCardProps) {
  return (
    <div 
      style={{
        background: 'var(--light)',
        borderRadius: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <div style={{ padding: '24px 24px 0 24px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: 'var(--dark)',
          margin: '0 0 4px 0'
        }}>
          {title}
        </h3>
        {description && (
          <p style={{ 
            color: 'var(--dark-grey)', 
            fontSize: '14px',
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '0 24px' }}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div 
          style={{
            padding: '16px 24px 24px 24px',
            borderTop: '1px solid var(--grey)',
            marginTop: '24px',
            background: 'var(--grey)',
          }}
        >
          {footer}
        </div>
      )}
      
      {/* Default spacing if no footer */}
      {!footer && (
        <div style={{ padding: '0 0 24px 0' }} />
      )}
    </div>
  );
}
