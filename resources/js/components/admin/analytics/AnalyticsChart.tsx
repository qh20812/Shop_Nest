import { BarChart3, Loader2 } from 'lucide-react';
import React, { useMemo } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Funnel,
    FunnelChart,
    LabelList,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from './analytics.module.css';

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
    valueFormatter?: (value: number) => string;
    valueLabel?: string;
    className?: string;
}

const defaultColors = [
    'var(--sn-color-accent)',
    'var(--sn-color-success)',
    'var(--sn-color-warning)',
    'var(--sn-color-danger)',
    'var(--sn-color-text-muted)',
    'var(--sn-color-border-strong)',
];

const axisTick = { fill: 'var(--sn-color-text-muted)', fontSize: 12 };
const axisLine = { stroke: 'var(--sn-color-border)' };
const gridStroke = 'var(--sn-color-border)';
const compactTickFormatter = (value: number | string) =>
    new Intl.NumberFormat('vi-VN', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
    }).format(Number(value));
const tooltipStyle = {
    borderRadius: 8,
    border: '1px solid var(--sn-color-border)',
    background: 'var(--sn-color-surface)',
    color: 'var(--sn-color-text)',
    boxShadow: 'var(--sn-shadow-popover)',
};

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
    valueFormatter,
    valueLabel,
    className = '',
}) => {
    const { t } = useTranslation();

    const palette = useMemo(() => (colors.length ? colors : defaultColors), [colors]);
    const hasData = Array.isArray(data) && data.length > 0;

    const renderTooltipValue = (
        value: number | string | readonly (string | number)[] | undefined,
        name: string | number | undefined,
        entry: { payload?: AnalyticsChartPoint } | undefined,
    ): [React.ReactNode, string] => {
        const numericValue = Number(value);
        const point = entry?.payload;
        const seriesName = name == null ? '' : String(name);

        if (tooltipFormatter) {
            return [tooltipFormatter(numericValue, seriesName, point as AnalyticsChartPoint), valueLabel ?? seriesName];
        }

        const formattedValue = valueFormatter && Number.isFinite(numericValue) ? valueFormatter(numericValue) : formatNumber(numericValue);

        // Pie/funnel slices are named by their category, which reads better than the chart title.
        const fallbackLabel = type === 'pie' || type === 'funnel' ? seriesName || title : title;

        return [formattedValue, valueLabel ?? fallbackLabel];
    };

    const tooltipContent = (
        <Tooltip
            formatter={(value, name, entry) => renderTooltipValue(value, name, entry)}
            contentStyle={tooltipStyle}
            labelStyle={{ color: 'var(--sn-color-text-muted)' }}
            itemStyle={{ color: 'var(--sn-color-text)' }}
        />
    );

    const renderChart = () => {
        if (!hasData) {
            return (
                <div className={styles.chartEmpty}>
                    <BarChart3 aria-hidden="true" className={styles.chartEmptyIcon} />
                    <p>{t('No data available for the selected filters')}</p>
                </div>
            );
        }

        switch (type) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid stroke={gridStroke} strokeWidth={1} />
                            <XAxis dataKey={categoryKey} tick={axisTick} stroke={axisLine.stroke} />
                            <YAxis tick={axisTick} stroke={axisLine.stroke} width={64} tickFormatter={compactTickFormatter} />
                            {tooltipContent}
                            {legend ? <Legend wrapperStyle={{ color: 'var(--sn-color-text-muted)' }} /> : null}
                            <Line
                                type="monotone"
                                dataKey={valueKey}
                                stroke={palette[0]}
                                strokeWidth={2}
                                dot={{ r: 3, strokeWidth: 2, stroke: 'var(--sn-color-surface)' }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid stroke={gridStroke} strokeWidth={1} />
                            <XAxis dataKey={categoryKey} tick={axisTick} stroke={axisLine.stroke} />
                            <YAxis tick={axisTick} stroke={axisLine.stroke} width={64} tickFormatter={compactTickFormatter} />
                            {tooltipContent}
                            {legend ? <Legend wrapperStyle={{ color: 'var(--sn-color-text-muted)' }} /> : null}
                            <Bar dataKey={valueKey} radius={[4, 4, 0, 0]}>
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
                            {tooltipContent}
                            {legend ? <Legend wrapperStyle={{ color: 'var(--sn-color-text-muted)' }} /> : null}
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={56}
                                outerRadius={96}
                                paddingAngle={2}
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
                            <CartesianGrid stroke={gridStroke} strokeWidth={1} />
                            <XAxis dataKey={categoryKey} tick={axisTick} stroke={axisLine.stroke} />
                            <YAxis tick={axisTick} stroke={axisLine.stroke} width={64} tickFormatter={compactTickFormatter} />
                            {tooltipContent}
                            {legend ? <Legend wrapperStyle={{ color: 'var(--sn-color-text-muted)' }} /> : null}
                            <Area
                                type="monotone"
                                dataKey={valueKey}
                                stroke={palette[0]}
                                strokeWidth={2}
                                fill="var(--sn-color-accent-wash)"
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'funnel':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <FunnelChart>
                            {tooltipContent}
                            <Funnel dataKey={valueKey} data={data} isAnimationActive={false} fill={palette[0]}>
                                <LabelList position="right" fill="var(--sn-color-text-muted)" stroke="none" dataKey={categoryKey} />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`${styles.chartCard} ${className}`.trim()}>
            <div className={styles.chartHead}>
                <div>
                    <h3 className={styles.chartTitle}>{title}</h3>
                    {description ? <span className={styles.chartDescription}>{description}</span> : null}
                </div>
            </div>

            <div className={styles.chartBody}>
                {loading ? (
                    <div className={styles.chartLoading}>
                        <Loader2 aria-hidden="true" className={styles.spin} />
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
