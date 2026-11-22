import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

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
        <div className={cx(styles.variantRoot, className)}>
            {groups.map((group) => {
                const isColor = /màu|color/i.test(group.name);
                const activeLabel = group.values.find((value) => value.id === selected[group.id])?.label;

                return (
                    <fieldset key={group.id} className={styles.variantGroup}>
                        <legend className={styles.variantLegend}>
                            {group.name}
                            {activeLabel && <span className={styles.variantLegendValue}>: {activeLabel}</span>}
                        </legend>
                        <div className={styles.variantOptions}>
                            {group.values.map((value) => {
                                const active = selected[group.id] === value.id;

                                return (
                                    <button
                                        key={value.id}
                                        type="button"
                                        disabled={value.disabled}
                                        aria-pressed={active}
                                        onClick={() => onChange(group.id, value.id)}
                                        className={styles.variantOption}
                                        data-active={active ? 'true' : undefined}
                                    >
                                        {isColor && <span aria-hidden="true" className={styles.variantSwatch} />}
                                        <span>{value.label}</span>
                                        {value.meta && <span className={styles.variantMeta}>{value.meta}</span>}
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
