import { cn } from '@/lib/utils';

type VariantValue = {
    id: number;
    label: string;
    disabled?: boolean;
    meta?: string;
};

type VariantGroup = {
    id: number;
    name: string;
    values: VariantValue[];
};

type VariantSelectorProps = {
    groups: VariantGroup[];
    selected: Record<number, number>;
    onChange: (groupId: number, valueId: number) => void;
    className?: string;
};

export function VariantSelector({ groups, selected, onChange, className }: VariantSelectorProps) {
    if (groups.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {groups.map((group) => {
                const isColor = /màu|color/i.test(group.name);

                return (
                    <fieldset key={group.id} className="flex flex-col gap-2">
                        <legend className="text-body-sm font-semibold text-ink">
                            {group.name}
                            {selected[group.id] && (
                                <span className="ml-1 font-normal text-ink-muted">
                                    : {group.values.find((value) => value.id === selected[group.id])?.label}
                                </span>
                            )}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                            {group.values.map((value) => {
                                const active = selected[group.id] === value.id;

                                return (
                                    <button
                                        key={value.id}
                                        type="button"
                                        disabled={value.disabled}
                                        aria-pressed={active}
                                        onClick={() => onChange(group.id, value.id)}
                                        className={cn(
                                            'focus-ring inline-flex min-h-control-sm items-center gap-2 rounded-control border px-3 py-2 text-body-sm font-medium transition-colors disabled:cursor-not-allowed disabled:border-border/50 disabled:bg-raw-linen/40 disabled:text-ink-faint',
                                            active
                                                ? 'border-lacquer-red bg-lacquer-wash/30 text-lacquer-red'
                                                : 'border-border bg-warm-porcelain text-ink hover:border-ink-muted',
                                        )}
                                    >
                                        {isColor && <span aria-hidden="true" className="size-3.5 rounded-pill border border-border bg-ink-faint" />}
                                        <span>{value.label}</span>
                                        {value.meta && <span className="font-mono text-label-micro text-ink-faint">{value.meta}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>
                );
            })}
        </div>
    );
}

export type { VariantGroup, VariantSelectorProps, VariantValue };
export default VariantSelector;
