import { Head, useForm } from '@inertiajs/react';
import { IdCard, Truck } from 'lucide-react';
import * as React from 'react';

import { AuthBrandPanel } from '@/components/layout/AuthBrandPanel';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TextLink } from '@/components/ui/text-link';
import { Heading, Text } from '@/components/ui/typography';

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    id_card_number: string;
    driver_license_number: string;
    vehicle_type: string;
    license_plate: string;
    id_card_front: File | null;
    id_card_back: File | null;
    driver_license_front: File | null;
}

const MAX_DOCUMENT_SIZE = 2 * 1024 * 1024;

export default function ShipperRegister() {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        id_card_number: '',
        driver_license_number: '',
        vehicle_type: '',
        license_plate: '',
        id_card_front: null,
        id_card_back: null,
        driver_license_front: null,
    });

    const [previews, setPreviews] = React.useState<{
        id_card_front?: string;
        id_card_back?: string;
        driver_license_front?: string;
    }>({});

    const handleFileChange = (field: keyof Pick<FormData, 'id_card_front' | 'id_card_back' | 'driver_license_front'>, file: File | null) => {
        setData(field, file);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviews((current) => ({ ...current, [field]: previewUrl }));
        } else {
            setPreviews((current) => ({ ...current, [field]: undefined }));
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post('/register/shipper', {
            onFinish: () => {
                reset('password', 'password_confirmation');
                Object.values(previews).forEach((url) => {
                    if (url) {
                        URL.revokeObjectURL(url);
                    }
                });
            },
        });
    };

    const renderDocument = (field: keyof Pick<FormData, 'id_card_front' | 'id_card_back' | 'driver_license_front'>, label: string) => (
        <div className="flex flex-col gap-2">
            <span className="text-body-sm font-medium text-ink">
                {label} <span className="text-lacquer-red">*</span>
            </span>
            {previews[field] && <img src={previews[field]} alt={label} className="h-28 w-full rounded-control border border-border object-cover" />}
            <FileDropzone
                accept="image/jpeg,image/png"
                maxSize={MAX_DOCUMENT_SIZE}
                multiple={false}
                files={data[field] ? [data[field] as File] : []}
                onFiles={(files) => handleFileChange(field, files[0] ?? null)}
                onRemove={() => handleFileChange(field, null)}
            />
            {errors[field] && (
                <span role="alert" className="text-body-sm text-brick">
                    {errors[field]}
                </span>
            )}
        </div>
    );

    return (
        <AuthLayout brand={<AuthBrandPanel role="shipper" />}>
            <Head title="Đăng ký giao vận" />

            <div className="flex flex-col gap-2">
                <Heading level={1} size="headline-1">
                    Trở thành đối tác giao vận
                </Heading>
                <Text size="body-md" tone="muted">
                    Tham gia mạng lưới ShopNest và nhận đơn giao rõ ràng mỗi ngày.
                </Text>
            </div>

            <form onSubmit={submit} className="mt-7 flex flex-col gap-8">
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                        <IdCard aria-hidden="true" className="size-5 text-lacquer-red" />
                        <h2 className="text-headline-3 text-ink">Thông tin cá nhân</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Họ" required error={errors.last_name}>
                            <Input
                                value={data.last_name}
                                onChange={(event) => setData('last_name', event.target.value)}
                                autoComplete="family-name"
                                invalid={Boolean(errors.last_name)}
                            />
                        </FormField>
                        <FormField label="Tên" required error={errors.first_name}>
                            <Input
                                value={data.first_name}
                                onChange={(event) => setData('first_name', event.target.value)}
                                autoComplete="given-name"
                                invalid={Boolean(errors.first_name)}
                            />
                        </FormField>
                        <FormField label="Email" required error={errors.email}>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                                autoComplete="email"
                                invalid={Boolean(errors.email)}
                            />
                        </FormField>
                        <FormField label="Số điện thoại" required error={errors.phone_number}>
                            <Input
                                value={data.phone_number}
                                onChange={(event) => setData('phone_number', event.target.value)}
                                placeholder="0912 345 678"
                                autoComplete="tel"
                                invalid={Boolean(errors.phone_number)}
                            />
                        </FormField>
                        <FormField label="Mật khẩu" required error={errors.password}>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                autoComplete="new-password"
                                invalid={Boolean(errors.password)}
                            />
                        </FormField>
                        <FormField label="Xác nhận mật khẩu" required error={errors.password_confirmation}>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(event) => setData('password_confirmation', event.target.value)}
                                autoComplete="new-password"
                                invalid={Boolean(errors.password_confirmation)}
                            />
                        </FormField>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                        <Truck aria-hidden="true" className="size-5 text-lacquer-red" />
                        <h2 className="text-headline-3 text-ink">Thông tin giao vận</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Số CCCD/CMND" required error={errors.id_card_number}>
                            <Input
                                value={data.id_card_number}
                                onChange={(event) => setData('id_card_number', event.target.value)}
                                placeholder="123456789012"
                                invalid={Boolean(errors.id_card_number)}
                            />
                        </FormField>
                        <FormField label="Số giấy phép lái xe" required error={errors.driver_license_number}>
                            <Input
                                value={data.driver_license_number}
                                onChange={(event) => setData('driver_license_number', event.target.value)}
                                placeholder="12-34567890"
                                invalid={Boolean(errors.driver_license_number)}
                            />
                        </FormField>
                        <FormField label="Loại phương tiện" required error={errors.vehicle_type}>
                            <Select
                                value={data.vehicle_type}
                                onChange={(event) => setData('vehicle_type', event.target.value)}
                                placeholder="Chọn phương tiện"
                                options={[
                                    { value: 'Motorbike', label: 'Xe máy' },
                                    { value: 'Bicycle', label: 'Xe đạp' },
                                    { value: 'Car', label: 'Ô tô' },
                                    { value: 'Van', label: 'Xe van' },
                                    { value: 'Truck', label: 'Xe tải' },
                                ]}
                                invalid={Boolean(errors.vehicle_type)}
                            />
                        </FormField>
                        <FormField label="Biển số xe" required error={errors.license_plate}>
                            <Input
                                value={data.license_plate}
                                onChange={(event) => setData('license_plate', event.target.value)}
                                placeholder="59A-12345"
                                invalid={Boolean(errors.license_plate)}
                            />
                        </FormField>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="border-b border-border pb-3">
                        <h2 className="text-headline-3 text-ink">Hồ sơ xác thực</h2>
                        <p className="mt-1 text-body-sm text-ink-muted">Ảnh rõ nét giúp hồ sơ được duyệt nhanh hơn. Tối đa 2MB mỗi ảnh.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {renderDocument('id_card_front', 'CCCD mặt trước')}
                        {renderDocument('id_card_back', 'CCCD mặt sau')}
                        {renderDocument('driver_license_front', 'Giấy phép lái xe')}
                    </div>
                </section>

                <div className="flex flex-col gap-3 border-t border-border pt-6">
                    <Button type="submit" size="lg" loading={processing} className="w-full">
                        Gửi hồ sơ
                    </Button>
                    <p className="text-center text-body-sm text-ink-muted">
                        Đã có tài khoản?{' '}
                        <TextLink href="/login" tone="accent" underline={false}>
                            Đăng nhập
                        </TextLink>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
