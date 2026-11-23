import { MapPin, Pencil, Star, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

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
        <article className={cx(styles.addressCard, className)} data-default={address.is_default ? 'true' : undefined}>
            <div className={styles.addressCardHead}>
                <span className={styles.addressCardName}>{address.name}</span>
                <span className={styles.addressCardPhone}>{address.phone}</span>
                {address.is_default ? (
                    <Badge tone="accent" size="sm" dot>
                        Mặc định
                    </Badge>
                ) : null}
            </div>

            <div className={styles.addressCardLocation}>
                <MapPin aria-hidden="true" className={styles.addressCardPin} />
                <span>{location}</span>
            </div>

            <div className={styles.addressCardActions}>
                {onEdit ? (
                    <Button variant="secondary" size="sm" leftIcon={Pencil} onClick={onEdit} disabled={busy}>
                        Sửa
                    </Button>
                ) : null}
                {onSetDefault && !address.is_default ? (
                    <Button variant="ghost" size="sm" leftIcon={Star} onClick={onSetDefault} disabled={busy}>
                        Đặt mặc định
                    </Button>
                ) : null}
                {onDelete ? (
                    <Button variant="ghost" size="sm" leftIcon={Trash2} onClick={onDelete} disabled={busy} className={styles.addressDelete}>
                        Xoá
                    </Button>
                ) : null}
            </div>
        </article>
    );
}

export type { AddressCardProps, AddressModel };
export default AddressCard;
