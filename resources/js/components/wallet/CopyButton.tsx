import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { useTranslation } from '@/lib/i18n';

interface CopyButtonProps {
    value: string;
    label: string;
}

export function CopyButton({ value, label }: CopyButtonProps) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) {
            return undefined;
        }

        const timer = window.setTimeout(() => setCopied(false), 2000);

        return () => window.clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    return (
        <>
            <IconButton size="sm" label={copied ? t('Copied') : label} onClick={handleCopy}>
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            </IconButton>
            <span className="sn-visually-hidden" aria-live="polite">
                {copied ? t('Copied') : ''}
            </span>
        </>
    );
}

export default CopyButton;
