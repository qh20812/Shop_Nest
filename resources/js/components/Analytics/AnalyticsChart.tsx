import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

export type AnalyticsChartType = 'line' | 'bar' | 'pie' | 'area' | 'funnel';

export interface AnalyticsChartPoint {
  label: string;
  value: number;
  [key: string]: string | number | null | undefined;
}

export interface AnalyticsChartProps {
  type: AnalyticsChartType;
  data: AnalyticsChartPoint[];
  title: string;
  description?: string;
  height?: number;
  valueKey?: string;
  categoryKey?: string;
  colors?: string[];
  loading?: boolean;
  legend?: boolean;
  tooltipFormatter?: (value: number, name: string, entry: AnalyticsChartPoint) => React.ReactNode;
  className?: string;
}

const defaultColors = ['#1976D2', '#26A69A', '#EF5350', '#FFB300', '#6D4C41', '#7E57C2'];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  type,
  data,
  title,
  description,
  height = 280,
  valueKey = 'value',
  categoryKey = 'label',
  colors = defaultColors,
  loading = false,
  legend = false,
  tooltipFormatter,
  className = '',
}) => {
  const { t } = useTranslation();

  const palette = useMemo(() => (colors.length ? colors : defaultColors), [colors]);
  const hasData = Array.isArray(data) && data.length > 0;

  const renderChart = () => {
    if (!hasData) {
      return (
        <div className="analytics-chart__empty">
          <i className="bx bx-bar-chart-alt"></i>
          <p>{t('No data available for the selected filters')}</p>
        </div>
      );
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25, 118, 210, 0.2)" />
              <XAxis dataKey={categoryKey} tick={{ fill: 'var(--dark)' }} stroke="var(--grey)" />
              <YAxis tick={{ fill: 'var(--dark)' }} stroke="var(--grey)" />
              <Tooltip
                formatter={(value: number, name: string, entry) =>
                  tooltipFormatter ? tooltipFormatter(value, name, entry.payload as AnalyticsChartPoint) : value
                }
                contentStyle={{ borderRadius: 12, border: '1px solid var(--grey)' }}
              />
              {legend ? <Legend /> : null}
              <Line
                type="monotone"
                dataKey={valueKey}
                stroke={palette[0]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, stroke: 'var(--light)' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,118,210,0.12)" />
              <XAxis dataKey={categoryKey} tick={{ fill: 'var(--dark)' }} stroke="var(--grey)" />
              <YAxis tick={{ fill: 'var(--dark)' }} stroke="var(--grey)" />
              <Tooltip
                formatter={(value: number, name: string, entry) =>
                  tooltipFormatter ? tooltipFormatter(value, name, entry.payload as AnalyticsChartPoint) : value
                }
                contentStyle={{ borderRadius: 12, border: '1px solid var(--grey)' }}
              />
              {legend ? <Legend /> : null}
              <Bar dataKey={valueKey} radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry[categoryKey]}-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Tooltip
                formatter={(value: number, name: string, entry) =>
                  tooltipFormatter ? tooltipFormatter(value, name, entry.payload as AnalyticsChartPoint) : value
                }
                contentStyle={{ borderRadius: 12, border: '1px solid var(--grey)' }}
              />
              {legend ? <Legend /> : null}
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey={valueKey}
                nameKey={categoryKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`slice-${entry[categoryKey]}-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="analyticsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={palette[0]} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={palette[0]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,118,210,0.12)" />
              <XAxis dataKey={categoryKey} tick={{ fill: 'var(--dark)' }} stroke="var(--grey)" />
              <YAxis tick={{ fill: 'var(--dark)' }} stroke="var(--grey)" />
              <Tooltip
                formatter={(value: number, name: string, entry) =>
                  tooltipFormatter ? tooltipFormatter(value, name, entry.payload as AnalyticsChartPoint) : value
                }
                contentStyle={{ borderRadius: 12, border: '1px solid var(--grey)' }}
              />
              {legend ? <Legend /> : null}
              <Area
                type="monotone"
                dataKey={valueKey}
                stroke={palette[0]}
                strokeWidth={3}
                fill="url(#analyticsAreaGradient)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <FunnelChart>
              <Tooltip
                formatter={(value: number, name: string, entry) =>
                  tooltipFormatter ? tooltipFormatter(value, name, entry.payload as AnalyticsChartPoint) : value
                }
                contentStyle={{ borderRadius: 12, border: '1px solid var(--grey)' }}
              />
              <Funnel
                dataKey={valueKey}
                data={data}
                isAnimationActive
                fill={palette[0]}
              >
                <LabelList
                  position="right"
                  fill="var(--dark)"
                  stroke="none"
                  dataKey={categoryKey}
                  formatter={(label: string) => label}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`analytics-chart chart-card ${className}`.trim()}>
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          {description ? <span>{description}</span> : null}
        </div>
      </div>

      <div className="chart-body">
        {loading ? (
          <div className="analytics-chart__loading">
            <i className="bx bx-loader-circle bx-spin"></i>
            <p>{t('Loading chart data...')}</p>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
