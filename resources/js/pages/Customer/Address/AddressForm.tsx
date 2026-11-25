import axios from 'axios';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';

import styles from '../customer.module.css';

export interface Division {
    id: number;
    name: string;
    code?: string;
}

export interface AddressFormValue {
    name: string;
    phone: string;
    address: string;
    province_id: string;
    ward_id: string;
    is_default: boolean;
}

type AddressFormProps = {
    value: AddressFormValue;
    onChange: (value: AddressFormValue) => void;
    provinces: Division[];
    initialWards?: Division[];
    initialProvinceId?: string;
    errors?: Record<string, string>;
    processing?: boolean;
    submitLabel?: string;
    onSubmit: (event: React.FormEvent) => void;
    onCancel: () => void;
};

export function AddressForm({
    value,
    onChange,
    provinces,
    initialWards = [],
    initialProvinceId,
    errors = {},
    processing = false,
    submitLabel,
    onSubmit,
    onCancel,
}: AddressFormProps) {
    const { t } = useTranslation();
    const resolvedSubmitLabel = submitLabel ?? t('Save address');
    const [wards, setWards] = React.useState<Division[]>(initialWards);
    const [loadingWards, setLoadingWards] = React.useState(false);

    React.useEffect(() => {
        if (!value.province_id) {
            setWards([]);
            return;
        }

        if (value.province_id === initialProvinceId && initialWards.length > 0) {
            setWards(initialWards);
            return;
        }

        let active = true;
        setLoadingWards(true);

        axios
            .get(`/user/addresses/wards/${value.province_id}`)
            .then((response) => {
                if (active) {
                    setWards(response.data?.data ?? []);
                }
            })
            .catch(() => {
                if (active) {
                    setWards([]);
                }
            })
            .finally(() => {
                if (active) {
                    setLoadingWards(false);
                }
            });

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.province_id]);

    const update = (partial: Partial<AddressFormValue>) => onChange({ ...value, ...partial });

    const isValid = Boolean(value.name.trim() && value.phone.trim() && value.address.trim() && value.province_id && value.ward_id);

    return (
        <form onSubmit={onSubmit} className={styles.formStack}>
            <div className={styles.addressFormGrid}>
                <FormField label={t('Recipient name')} required error={errors.name}>
                    <Input
                        value={value.name}
                        onChange={(event) => update({ name: event.target.value })}
                        placeholder={t('e.g. Nguyen Thu Ha')}
                        autoComplete="name"
                        invalid={Boolean(errors.name)}
                        required
                    />
                </FormField>

                <FormField label={t('Phone number')} required error={errors.phone}>
                    <Input
                        type="tel"
                        value={value.phone}
                        onChange={(event) => update({ phone: event.target.value })}
                        placeholder="0912 345 678"
                        autoComplete="tel"
                        invalid={Boolean(errors.phone)}
                        required
                    />
                </FormField>
            </div>

            <FormField label={t('Address')} required error={errors.address} hint={t('House number, street, building, delivery notes.')}>
                <Input
                    value={value.address}
                    onChange={(event) => update({ address: event.target.value })}
                    placeholder={t('e.g. 12 Nguyen Hue street')}
                    autoComplete="street-address"
                    invalid={Boolean(errors.address)}
                    required
                />
            </FormField>

            <div className={styles.addressFormGrid}>
                <FormField label={t('Province/City')} required error={errors.province_id}>
                    <Select
                        value={value.province_id}
                        onChange={(event) => update({ province_id: event.target.value, ward_id: '' })}
                        placeholder={t('Select province/city')}
                        options={provinces.map((province) => ({ value: String(province.id), label: province.name }))}
                        invalid={Boolean(errors.province_id)}
                        required
                    />
                </FormField>

                <FormField label={t('Ward')} required error={errors.ward_id}>
                    <Select
                        value={value.ward_id}
                        onChange={(event) => update({ ward_id: event.target.value })}
                        placeholder={loadingWards ? t('Loading...') : t('Select ward')}
                        options={wards.map((ward) => ({ value: String(ward.id), label: ward.name }))}
                        disabled={!value.province_id || loadingWards}
                        invalid={Boolean(errors.ward_id)}
                        required
                    />
                </FormField>
            </div>

            <Checkbox
                checked={value.is_default}
                onCheckedChange={(checked) => update({ is_default: checked === true })}
                label={t('Set as default address')}
                description={t('ShopNest will use this address for your next checkout.')}
            />

            <div className={styles.formFooter}>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={processing}>
                    {t('Cancel')}
                </Button>
                <Button type="submit" loading={processing} disabled={!isValid}>
                    {resolvedSubmitLabel}
                </Button>
            </div>
        </form>
    );
}

export default AddressForm;
