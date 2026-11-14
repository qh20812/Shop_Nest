import { MapPin, Pencil, Star, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AddressModel = {
    id: number | string;
    name: string;
    phone: string;
    address: string;
    ward?: string;
    district?: string;
    province?: string;
    country?: string;
    is_default?: boolean;
};

type AddressCardProps = {
    address: AddressModel;
    onEdit?: () => void;
    onDelete?: () => void;
    onSetDefault?: () => void;
    busy?: boolean;
    className?: string;
};

export function AddressCard({ address, onEdit, onDelete, onSetDefault, busy = false, className }: AddressCardProps) {
    const location = [address.address, address.ward, address.district, address.province, address.country].filter(Boolean).join(', ');

    return (
        <article
            className={cn(
                'flex flex-col gap-4 rounded-card border bg-warm-porcelain p-5 transition-colors',
                address.is_default ? 'border-lacquer-red' : 'border-border',
                className,
            )}
        >
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-body-md font-semibold text-ink">{address.name}</span>
                <span className="font-mono text-label-code text-ink-muted">{address.phone}</span>
                {address.is_default && (
                    <Badge tone="accent" size="sm" dot>
                        Mặc định
                    </Badge>
                )}
            </div>

            <div className="flex items-start gap-2 text-body-sm text-ink-muted">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-lacquer-red" />
                <span>{location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                {onEdit && (
                    <Button variant="secondary" size="sm" leftIcon={Pencil} onClick={onEdit} disabled={busy}>
                        Sửa
                    </Button>
                )}
                {onSetDefault && !address.is_default && (
                    <Button variant="ghost" size="sm" leftIcon={Star} onClick={onSetDefault} disabled={busy}>
                        Đặt mặc định
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Trash2}
                        onClick={onDelete}
                        disabled={busy}
                        className="text-brick hover:bg-brick-soft hover:text-brick"
                    >
                        Xoá
                    </Button>
                )}
            </div>
        </article>
    );
}

export type { AddressCardProps, AddressModel };
export default AddressCard;
