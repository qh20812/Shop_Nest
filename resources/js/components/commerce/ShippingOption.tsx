import { RadioCard } from '@/components/ui/radio-card';
import { formatVnd } from '@/lib/format';
import { cn } from '@/lib/utils';

type ShippingOptionProps = {
    name?: string;
    value: string;
    selected: boolean;
    title: string;
    description?: string;
    price?: number;
    eta?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    className?: string;
};

export function ShippingOption({
    name = 'shipping_method',
    value,
    selected,
    title,
    description,
    price = 0,
    eta,
    disabled,
    onChange,
    className,
}: ShippingOptionProps) {
    return (
        <RadioCard
            name={name}
            value={value}
            checked={selected}
            disabled={disabled}
            onChange={() => onChange(value)}
            title={title}
            description={description}
            meta={<span className="font-mono text-label-code text-ink">{price > 0 ? formatVnd(price) : 'Miễn phí'}</span>}
            className={cn(className)}
        >
            {eta && <span className="text-label-micro text-ink-faint">{eta}</span>}
        </RadioCard>
    );
}

export type { ShippingOptionProps };
export default ShippingOption;
