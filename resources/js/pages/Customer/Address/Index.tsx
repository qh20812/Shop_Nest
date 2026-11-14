import { Head, Link, router, usePage } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';
import * as React from 'react';

import { AddressCard } from '@/components/commerce/AddressCard';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
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
    addresses?: AddressModel[];
}

export default function AddressIndex() {
    const { addresses = [] } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [pendingDelete, setPendingDelete] = React.useState<AddressModel | null>(null);
    const [deleting, setDeleting] = React.useState(false);
    const [busyId, setBusyId] = React.useState<number | null>(null);

    const handleSetDefault = (address: AddressModel) => {
        setBusyId(address.id);
        router.patch(
            `/user/addresses/${address.id}/default`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => success('Đã đặt làm địa chỉ mặc định'),
                onError: () => showError('Không thể đặt địa chỉ mặc định'),
                onFinish: () => setBusyId(null),
            },
        );
    };

    const handleDelete = () => {
        if (!pendingDelete) {
            return;
        }

        setDeleting(true);
        router.delete(`/user/addresses/${pendingDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                success('Đã xoá địa chỉ');
                setPendingDelete(null);
            },
            onError: () => showError('Không thể xoá địa chỉ'),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AccountLayout
            active="addresses"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Địa chỉ' }]}
            eyebrow="Tài khoản"
            title="Địa chỉ giao hàng"
            description="Quản lý địa chỉ nhận hàng và chọn địa chỉ mặc định cho lần thanh toán tiếp theo."
            count={`${addresses.length} địa chỉ`}
            actions={
                <Button leftIcon={Plus} asChild>
                    <Link href="/user/addresses/create">Thêm địa chỉ</Link>
                </Button>
            }
        >
            <Head title="Địa chỉ giao hàng" />

            {addresses.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="Chưa có địa chỉ nào"
                    description="Thêm địa chỉ đầu tiên để đặt hàng nhanh hơn ở lần mua tiếp theo."
                    actions={
                        <Button leftIcon={Plus} asChild>
                            <Link href="/user/addresses/create">Thêm địa chỉ</Link>
                        </Button>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            busy={busyId === address.id || deleting}
                            onEdit={() => router.visit(`/user/addresses/${address.id}/edit`)}
                            onSetDefault={() => handleSetDefault(address)}
                            onDelete={() => setPendingDelete(address)}
                        />
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPendingDelete(null);
                    }
                }}
                title="Xoá địa chỉ này?"
                description={
                    pendingDelete
                        ? `${pendingDelete.name} — ${pendingDelete.address}, ${pendingDelete.ward}, ${pendingDelete.province}. Địa chỉ đã xoá không thể khôi phục.`
                        : ''
                }
                confirmLabel="Xoá địa chỉ"
                loading={deleting}
                onConfirm={handleDelete}
            />
        </AccountLayout>
    );
}
