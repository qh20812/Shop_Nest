import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({ 
  content, 
  children, 
  position = 'top',
  delay = 500 
}: TooltipProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getPositionStyles = () => {
    const base = {
      position: 'absolute' as const,
      background: 'var(--dark)',
      color: 'var(--light)',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      whiteSpace: 'nowrap' as const,
      zIndex: 1000,
      pointerEvents: 'none' as const,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.2s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '5px'
        };
      case 'bottom':
        return {
          ...base,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '5px'
        };
      case 'left':
        return {
          ...base,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '5px'
        };
      case 'right':
        return {
          ...base,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '5px'
        };
      default:
        return base;
    }
  };

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (showTimeout) {
        clearTimeout(showTimeout);
      }
    };
  }, [showTimeout]);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        ref={tooltipRef}
        style={getPositionStyles()}
      >
        {t(content)}
      </div>
    </div>
  );
}
