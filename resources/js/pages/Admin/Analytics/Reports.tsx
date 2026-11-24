import { Head, router, usePage } from '@inertiajs/react';
import { FileText, RefreshCw } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import AnalyticsFilters, { type AnalyticsFilterState, type AnalyticsFilterValue } from '@/components/admin/analytics/AnalyticsFilters';
import type { AnalyticsTableColumn } from '@/components/admin/analytics/AnalyticsTable';
import AnalyticsTable from '@/components/admin/analytics/AnalyticsTable';
import ExportButton from '@/components/admin/analytics/ExportButton';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { Select } from '@/components/ui/select';
import AppLayout from '@/layouts/app/AppLayout';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

type ReportDataRecord = Record<string, unknown>;

interface ReportPayload extends Record<string, unknown> {
    type?: string;
    filters?: Record<string, unknown>;
    data?: unknown;
    exportPath?: string | null;
    exportFormat?: string | null;
}

interface ReportsPageProps extends Record<string, unknown> {
    report?: ReportPayload;
    filters?: Record<string, unknown>;
    availableTypes?: string[];
    exportFormats?: string[];
    locale?: string;
}

type ReportFilterState = AnalyticsFilterState & {
    type: AnalyticsFilterValue;
    period: AnalyticsFilterValue;
    date_from: AnalyticsFilterValue;
    date_to: AnalyticsFilterValue;
    category_id: AnalyticsFilterValue;
    seller_id: AnalyticsFilterValue;
    segment_id: AnalyticsFilterValue;
};

type FilterPayload = Record<string, string | number | boolean>;

function normalizeFilterValue(value: unknown, fallback: AnalyticsFilterValue = ''): AnalyticsFilterValue {
    if (value === null || value === undefined) {
        return fallback;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return value;
    }

    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }

    return fallback;
}

function cleanupFilters(filters: AnalyticsFilterState): Record<string, string | number> {
    const payload: Record<string, string | number> = {};

    Object.entries(filters).forEach(([key, rawValue]) => {
        if (typeof rawValue === 'number') {
            payload[key] = rawValue;
            return;
        }

        if (typeof rawValue === 'string' && rawValue !== '') {
            payload[key] = rawValue;
        }
    });

    return payload;
}

function findFirstRecordArray(value: unknown, seen = new Set<unknown>()): ReportDataRecord[] {
    if (value === null || value === undefined) {
        return [];
    }

    if (seen.has(value)) {
        return [];
    }

    if (Array.isArray(value)) {
        seen.add(value);
        const objectEntries = value.filter(
            (entry): entry is ReportDataRecord => entry !== null && typeof entry === 'object' && !Array.isArray(entry),
        );
        if (objectEntries.length > 0) {
            return objectEntries;
        }
        for (const entry of value) {
            const nested = findFirstRecordArray(entry, seen);
            if (nested.length > 0) {
                return nested;
            }
        }
        return [];
    }

    if (typeof value === 'object') {
        seen.add(value);
        return (
            Object.values(value as Record<string, unknown>)
                .map((nested) => findFirstRecordArray(nested, seen))
                .find((result) => result.length > 0) ?? []
        );
    }

    return [];
}

const Reports: React.FC = () => {
    const { props } = usePage<ReportsPageProps>();
    const report = useMemo<ReportPayload>(() => props.report ?? {}, [props.report]);
    const initialFilters = props.filters ?? {};
    const { t } = useTranslation();

    const [filters, setFilters] = useState<ReportFilterState>(() => ({
        type: normalizeFilterValue(initialFilters['type'], report.type ?? 'revenue'),
        period: normalizeFilterValue(initialFilters['period'], ''),
        date_from: normalizeFilterValue(initialFilters['date_from'], ''),
        date_to: normalizeFilterValue(initialFilters['date_to'], ''),
        category_id: normalizeFilterValue(initialFilters['category_id'], ''),
        seller_id: normalizeFilterValue(initialFilters['seller_id'], ''),
        segment_id: normalizeFilterValue(initialFilters['segment_id'], ''),
    }));

    const [exportFormat, setExportFormat] = useState<string>('');

    const panelFilters = useMemo<AnalyticsFilterState>(() => {
        const { type, ...rest } = filters;
        void type;
        return rest as AnalyticsFilterState;
    }, [filters]);

    const previewRows = useMemo(() => findFirstRecordArray(report.data), [report.data]);

    const previewColumns: AnalyticsTableColumn<ReportDataRecord>[] = useMemo(() => {
        if (previewRows.length === 0) {
            return [];
        }

        const keySet = new Set<string>();
        previewRows.forEach((row) => Object.keys(row ?? {}).forEach((key) => keySet.add(key)));

        return Array.from(keySet).map((key) => ({
            key,
            label: t(key),
            sortable: false,
            render: (value: unknown) => {
                if (typeof value === 'number') {
                    return formatNumber(value);
                }
                return typeof value === 'undefined' || value === null ? t('N/A') : String(value);
            },
        }));
    }, [previewRows, t]);

    const availableTypes = useMemo(() => props.availableTypes ?? [], [props.availableTypes]);
    const exportFormats = useMemo(() => props.exportFormats ?? [], [props.exportFormats]);

    const handleFilterChange = (updated: AnalyticsFilterState) => {
        setFilters((previous) => ({ ...previous, ...updated }));
    };

    const handleGenerate = () => {
        const payload: FilterPayload = {
            ...cleanupFilters(filters),
            type: String(filters.type ?? 'revenue'),
        };

        router.get('/admin/analytics/reports', payload, { preserveState: true, preserveScroll: true });
    };

    const handleDownload = (format: string) => {
        const payload: FilterPayload = {
            ...cleanupFilters(filters),
            type: String(filters.type ?? 'revenue'),
            export_format: format,
            download: true,
        };

        router.get('/admin/analytics/reports', payload, { preserveScroll: true });
    };

    const handleReset = () => {
        setFilters({ type: 'revenue', period: '', date_from: '', date_to: '', category_id: '', seller_id: '', segment_id: '' });
        setExportFormat('');
        router.get('/admin/analytics/reports', { type: 'revenue' }, { preserveState: true, preserveScroll: true });
    };

    const reportMeta = useMemo(
        () => ({
            type: report.type ?? 'revenue',
            exportPath: report.exportPath ?? null,
            exportFormat: report.exportFormat ?? null,
        }),
        [report.exportFormat, report.exportPath, report.type],
    );

    return (
        <AppLayout>
            <Head title={t('Analytics Reports')} />
            <Header
                title={t('Analytics Reports')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Analytics'), href: '/admin/analytics' },
                    { label: t('Analytics Reports'), href: '/admin/analytics/reports', active: true },
                ]}
            />

            <div className={styles.stack}>
                <section className={styles.section}>
                    <p className={styles.muted}>
                        {t('Generate tailored analytics bundles, preview the dataset, and export the results for deeper analysis.')}
                    </p>
                </section>

                <div className={styles.gridTwo}>
                    <section className={styles.section}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <FileText aria-hidden="true" className={styles.sectionIcon} />
                                {t('Report Builder')}
                            </h2>
                        </div>

                        <AnalyticsFilters
                            filters={panelFilters}
                            onFilterChange={handleFilterChange}
                            title={t('Configure Report Criteria')}
                            description={t('Select the report type, timeframe, and any additional filters to shape the output.')}
                            onReset={handleReset}
                        >
                            <div className={styles.filterGrid}>
                                <div className={styles.filterField}>
                                    <span className={styles.filterLabel}>{t('Report Type')}</span>
                                    <Select
                                        value={String(filters.type ?? 'revenue')}
                                        aria-label={t('Report Type')}
                                        onChange={(event) =>
                                            setFilters((previous) => ({
                                                ...previous,
                                                type: event.target.value,
                                            }))
                                        }
                                    >
                                        {availableTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {t(type)}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div className={styles.filterField}>
                                    <span className={styles.filterLabel}>{t('Export Format')}</span>
                                    <Select
                                        value={exportFormat}
                                        aria-label={t('Export Format')}
                                        onChange={(event) => setExportFormat(event.target.value)}
                                    >
                                        <option value="">{t('Select format')}</option>
                                        {exportFormats.map((format) => (
                                            <option key={format} value={format}>
                                                {format.toUpperCase()}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            <div className={styles.filterActions}>
                                <Button type="button" variant="primary" onClick={handleGenerate}>
                                    <RefreshCw aria-hidden="true" />
                                    {t('Generate Report')}
                                </Button>
                                <ExportButton
                                    label={t('Download Report')}
                                    onClick={() => {
                                        if (exportFormat) {
                                            handleDownload(exportFormat);
                                        }
                                    }}
                                    disabled={!exportFormat}
                                    variant="secondary"
                                />
                            </div>
                        </AnalyticsFilters>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>{t('Preview')}</h2>
                            <div className={styles.cellStack}>
                                <span className={styles.cellMeta}>
                                    {t('Current type')}: <strong>{t(reportMeta.type)}</strong>
                                </span>
                                {reportMeta.exportPath ? (
                                    <span className={styles.cellMeta}>
                                        {t('Last export')}: {reportMeta.exportFormat?.toUpperCase()} ({reportMeta.exportPath})
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <AnalyticsTable
                            data={previewRows}
                            columns={previewColumns}
                            emptyMessage={t('No preview data available. Adjust filters and regenerate the report.')}
                            rowKey={(row, index) => {
                                const identifier = row.id;
                                if (typeof identifier === 'string' || typeof identifier === 'number') {
                                    return identifier;
                                }
                                return `report-row-${index}`;
                            }}
                        />
                    </section>
                </div>

                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>{t('Saved Reports')}</h2>
                    </div>
                    <p className={styles.muted}>
                        {t('Saved report history is not yet available. Exports generated here can be downloaded immediately.')}
                    </p>
                </section>
            </div>
        </AppLayout>
    );
};

export default Reports;
