import React from 'react';
import '@/../css/Page.css';

export type AnalyticsCardColor = 'blue' | 'green' | 'red' | 'yellow' | 'neutral';

export interface AnalyticsCardProps {
  title: string;
  value: string | number | React.ReactNode;
  change?: number | null;
  changeLabel?: string;
  icon?: string;
  color?: AnalyticsCardColor;
  tooltip?: string;
  compact?: boolean;
  footer?: React.ReactNode;
  className?: string;
  valueFormatter?: (value: string | number) => React.ReactNode;
  as?: 'li' | 'div';
}

const colorClassMap: Record<AnalyticsCardColor, string> = {
  blue: 'analytics-card--blue',
  green: 'analytics-card--green',
  red: 'analytics-card--red',
  yellow: 'analytics-card--yellow',
  neutral: 'analytics-card--neutral',
};

const defaultNumberFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

function formatChange(change: number): string {
  if (Number.isNaN(change)) {
    return '0%';
  }

  return `${Math.abs(change).toFixed(Math.abs(change) < 1 ? 2 : 1)}%`;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon = 'bx bx-pie-chart-alt-2',
  color = 'blue',
  tooltip,
  compact = false,
  footer,
  className = '',
  valueFormatter,
  as: ComponentTag = 'li',
}) => {
  const hasChange = typeof change === 'number' && Number.isFinite(change);
  const trend = hasChange ? (change as number) >= 0 ? 'up' : 'down' : null;

  const resolvedValue =
    typeof value === 'number'
      ? valueFormatter
        ? valueFormatter(value)
        : defaultNumberFormatter.format(value)
      : value;

  return (
    <ComponentTag
      className={`analytics-card ${colorClassMap[color]} ${compact ? 'analytics-card--compact' : ''} ${className}`.trim()}
      title={tooltip}
    >
      <div className="analytics-card__icon-wrapper">
        <i className={icon}></i>
      </div>

      <div className="analytics-card__content">
        <span className="analytics-card__title">{title}</span>
        <span className="analytics-card__value">{resolvedValue}</span>

        {hasChange && (
          <span className={`analytics-card__change analytics-card__change--${trend}`}>
            <i className={`bx ${trend === 'up' ? 'bx-trending-up' : 'bx-trending-down'}`}></i>
            {formatChange(change as number)}
            {changeLabel ? <span className="analytics-card__change-label">{` ${changeLabel}`}</span> : null}
          </span>
        )}

        {footer ? <div className="analytics-card__footer">{footer}</div> : null}
      </div>
    </ComponentTag>
  );
};

export default AnalyticsCard;
