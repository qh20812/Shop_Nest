import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, MapPin, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

interface AddressModel {
    id: number;
    name: string;
    phone: string;
    address: string;
    ward: string;
    province: string;
    country: string;
    is_default: boolean;
}

interface PageProps extends Record<string, unknown> {
    address: AddressModel;
}

export default function AddressShow() {
    const { address } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const fullAddress = [address.address, address.ward, address.province, address.country].filter(Boolean).join(', ');

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/user/addresses/${address.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                success('Đã xoá địa chỉ');
            },
            onError: () => showError('Không thể xoá địa chỉ'),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AccountLayout
            active="addresses"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Địa chỉ', href: '/user/addresses' }, { label: address.name }]}
            eyebrow="Chi tiết địa chỉ"
            title={address.name}
            description="Thông tin địa chỉ dùng khi giao hàng."
            actions={
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" leftIcon={ArrowLeft} asChild>
                        <Link href="/user/addresses">Danh sách</Link>
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={Pencil} onClick={() => router.visit(`/user/addresses/${address.id}/edit`)}>
                        Sửa
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Trash2}
                        className="text-brick hover:bg-brick-soft hover:text-brick"
                        onClick={() => setConfirmOpen(true)}
                    >
                        Xoá
                    </Button>
                </div>
            }
        >
            <Head title={`Địa chỉ ${address.name}`} />

            <Card padding="lg" className="max-w-2xl">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-headline-3 text-ink">{address.name}</span>
                        <span className="font-mono text-label-code text-ink-muted">{address.phone}</span>
                        {address.is_default && (
                            <Badge tone="success" icon={BadgeCheck}>
                                Mặc định
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-start gap-3 rounded-control bg-rice-paper p-4">
                        <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-lacquer-red" />
                        <div className="flex flex-col gap-1">
                            <span className="text-label-micro font-semibold tracking-[0.12em] text-ink-faint uppercase">Địa chỉ giao hàng</span>
                            <span className="text-body-md text-ink">{fullAddress}</span>
                        </div>
                    </div>

                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-control border border-border p-3">
                            <dt className="text-label-micro tracking-[0.12em] text-ink-faint uppercase">Tỉnh/Thành phố</dt>
                            <dd className="mt-1 text-body-sm text-ink">{address.province || '—'}</dd>
                        </div>
                        <div className="rounded-control border border-border p-3">
                            <dt className="text-label-micro tracking-[0.12em] text-ink-faint uppercase">Xã/Phường</dt>
                            <dd className="mt-1 text-body-sm text-ink">{address.ward || '—'}</dd>
                        </div>
                    </dl>
                </div>
            </Card>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Xoá địa chỉ này?"
                description={`${fullAddress}. Địa chỉ đã xoá không thể khôi phục.`}
                confirmLabel="Xoá địa chỉ"
                loading={deleting}
                onConfirm={handleDelete}
            />
        </AccountLayout>
    );
}
