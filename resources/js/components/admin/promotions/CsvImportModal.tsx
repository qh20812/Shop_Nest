import React, { useEffect, useState } from 'react';

interface CsvImportModalProps {
    promotionId: number;
    isOpen: boolean;
    onClose: () => void;
}

interface ImportStatus {
    tracking_token: string;
    filename: string;
    status: 'processing' | 'completed' | 'failed';
    total_rows: number;
    processed_rows: number;
    failed_rows: number;
    completed_at?: string | null;
    error_log?: string | null;
}

function getCsrfToken(): string {
    const element = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    return element?.content ?? '';
}

export default function CsvImportModal({ promotionId, isOpen, onClose }: CsvImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<ImportStatus | null>(null);
    const [pollToken, setPollToken] = useState<string | null>(null);

    useEffect(() => {
        if (!pollToken) {
            return;
        }

        const interval = window.setInterval(async () => {
            try {
                const response = await fetch(`/admin/promotions/imports/${pollToken}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    return;
                }

                const payload: { success: boolean; import: ImportStatus } = await response.json();

                if (payload.success) {
                    setStatus(payload.import);

                    if (payload.import.status !== 'processing') {
                        window.clearInterval(interval);
                    }
                }
            } catch (exception) {
                console.error('Failed to poll import status', exception);
            }
        }, 3000);

        return () => window.clearInterval(interval);
    }, [pollToken]);

    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setSubmitting(false);
            setError(null);
            setStatus(null);
            setPollToken(null);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!file) {
            setError('Please choose a CSV file to import.');
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/admin/promotions/${promotionId}/bulk-import`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                setError(payload?.message || 'Failed to start bulk import.');
                return;
            }

            const payload: { success: boolean; tracking_token: string; status: ImportStatus['status']; import_id: number } =
                await response.json();

            if (payload.success) {
                setPollToken(payload.tracking_token);
            } else {
                setError('Bulk import could not be started.');
            }
        } catch (exception) {
            setError(exception instanceof Error ? exception.message : 'Unexpected error occurred while uploading file.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1100,
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '420px',
                    maxWidth: '95%',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--dark)' }}>Bulk Import Products</h3>
                    <button type="button" className="btn btn-icon" onClick={onClose}>
                        <i className="bx bx-x" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{ fontWeight: 500, color: 'var(--dark)', display: 'block', marginBottom: '6px' }}>
                                CSV file
                            </label>
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                                disabled={submitting}
                            />
                            <p style={{ fontSize: '12px', color: 'var(--dark-grey)', marginTop: '4px' }}>
                                File must include a <code>product_id</code> column and can optionally include <code>sku</code>.
                            </p>
                        </div>

                        {error && <div style={{ color: 'var(--danger)', fontSize: '13px' }}>{error}</div>}

                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Uploading…' : 'Start Import'}
                        </button>
                    </div>
                </form>

                {status && (
                    <div
                        style={{
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '12px',
                            background: 'var(--light)',
                        }}
                    >
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--dark)' }}>Import status</h4>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--dark-grey)' }}>
                            <li>Status: {status.status}</li>
                            <li>Processed: {status.processed_rows}/{status.total_rows}</li>
                            <li>Failed rows: {status.failed_rows}</li>
                            {status.completed_at && <li>Completed at: {status.completed_at}</li>}
                        </ul>
                        {status.error_log && (
                            <pre
                                style={{
                                    marginTop: '8px',
                                    maxHeight: '120px',
                                    overflow: 'auto',
                                    background: '#fdf6f6',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    color: '#c53030',
                                    fontSize: '12px',
                                }}
                            >
                                {status.error_log}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
