import { Tag, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PromoFieldProps = {
    value: string;
    onChange: (value: string) => void;
    onApply: () => void;
    onRemove?: () => void;
    appliedCode?: string | null;
    appliedLabel?: string;
    error?: string | null;
    loading?: boolean;
    className?: string;
};

export function PromoField({ value, onChange, onApply, onRemove, appliedCode, appliedLabel, error, loading = false, className }: PromoFieldProps) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label htmlFor="promo-code" className="text-label-micro font-semibold tracking-[0.12em] text-ink-muted uppercase">
                Ưu đãi & mã giảm giá
            </label>

            {appliedCode ? (
                <div className="flex items-center justify-between gap-3 rounded-control border border-border bg-raw-linen px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <Tag aria-hidden="true" className="size-4 text-lacquer-red" />
                        <span className="font-mono text-label-code font-semibold text-ink">{appliedCode}</span>
                        {appliedLabel && <span className="truncate text-body-sm text-ink-muted">{appliedLabel}</span>}
                    </div>
                    {onRemove && (
                        <button
                            type="button"
                            aria-label="Bỏ mã giảm giá"
                            className="focus-ring rounded-chip p-1 text-ink-muted transition-colors hover:text-brick"
                            onClick={onRemove}
                        >
                            <X aria-hidden="true" className="size-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex gap-2">
                    <Input
                        id="promo-code"
                        value={value}
                        onChange={(event) => onChange(event.target.value.toUpperCase())}
                        placeholder="Nhập mã khuyến mãi"
                        className="flex-1 uppercase"
                        invalid={Boolean(error)}
                    />
                    <Button type="button" variant="secondary" loading={loading} onClick={onApply} className="shrink-0">
                        Áp dụng
                    </Button>
                </div>
            )}

            {error && (
                <span role="alert" className="text-body-sm text-brick">
                    {error}
                </span>
            )}
        </div>
    );
}

export type { PromoFieldProps };
export default PromoField;
