import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

interface DocumentViewerProps {
    imageUrl: string;
    documentName: string;
    onClose: () => void;
}

export default function DocumentViewer({ imageUrl, documentName, onClose }: DocumentViewerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const { t } = useTranslation();
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
            }}
            onClick={handleBackdropClick}
        >
            <div
                style={{
                    background: 'var(--light)',
                    borderRadius: '12px',
                    padding: '20px',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--grey)',
                    }}
                >
                    <h3 style={{ margin: 0, color: 'var(--dark)' }}>
                        {documentName}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: 'var(--dark-grey)',
                            padding: '0',
                        }}
                    >
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                {/* Image Container */}
                <div
                    style={{
                        position: 'relative',
                        maxWidth: '800px',
                        maxHeight: '600px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {isLoading && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'var(--dark-grey)',
                            }}
                        >
                            <i className="bx bx-loader-alt bx-spin"></i>
                            {t('Loading...')}
                        </div>
                    )}

                    {hasError && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                color: 'var(--danger)',
                                padding: '40px',
                            }}
                        >
                            <i className="bx bx-error-circle" style={{ fontSize: '48px' }}></i>
                            <p style={{ margin: 0, textAlign: 'center' }}>
                                {t('Failed to load document image.')}<br />
                                {t('Please check if the file exists and try again.')}
                            </p>
                        </div>
                    )}

                    {!hasError && (
                        <img
                            src={imageUrl}
                            alt={documentName}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                border: '1px solid var(--grey)',
                                display: isLoading ? 'none' : 'block',
                            }}
                        />
                    )}
                </div>

                {/* Actions */}
                <div
                    style={{
                        marginTop: '16px',
                        display: 'flex',
                        gap: '12px',
                    }}
                >
                    <button
                        onClick={() => window.open(imageUrl, '_blank')}
                        disabled={hasError}
                        style={{
                            padding: '8px 16px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: hasError ? 'not-allowed' : 'pointer',
                            opacity: hasError ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <i className="bx bx-link-external"></i>
                        {t('Open in New Tab')}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            background: 'var(--grey)',
                            color: 'var(--dark)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        {t('Close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
