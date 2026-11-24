import { AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslation } from '@/lib/i18n';

import styles from './shippers.module.css';

interface DocumentViewerProps {
    imageUrl: string;
    documentName: string;
    onClose: () => void;
}

export default function DocumentViewer({ imageUrl, documentName, onClose }: DocumentViewerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { t } = useTranslation();

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={documentName}
            size="lg"
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        {t('Close')}
                    </Button>
                    <Button type="button" variant="primary" onClick={() => window.open(imageUrl, '_blank')} disabled={hasError}>
                        <ExternalLink aria-hidden="true" />
                        {t('Open in New Tab')}
                    </Button>
                </>
            }
        >
            <div className={styles.viewerImageWrap}>
                {isLoading && (
                    <div className={styles.viewerStatus}>
                        <Loader2 aria-hidden="true" className={styles.spin} />
                        {t('Loading...')}
                    </div>
                )}

                {hasError && (
                    <div className={`${styles.viewerStatus} ${styles.viewerError}`.trim()}>
                        <AlertTriangle aria-hidden="true" className={styles.viewerIcon} />
                        <p>
                            {t('Failed to load document image.')}
                            <br />
                            {t('Please check if the file exists and try again.')}
                        </p>
                    </div>
                )}

                {!hasError && (
                    <img
                        src={imageUrl}
                        alt={documentName}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                        className={styles.viewerImage}
                        hidden={isLoading}
                    />
                )}
            </div>
        </Dialog>
    );
}
