import React from 'react';
import InputError from '@/Components/input-error';

export interface PromotionRule {
    type: string;
    operator: string;
    value: unknown;
}

interface RuleBuilderProps {
    value: PromotionRule[];
    onChange: (rules: PromotionRule[]) => void;
    ruleOptions: {
        types: string[];
        operators: string[];
    };
    disabled?: boolean;
    error?: string;
}

const defaultRule: PromotionRule = {
    type: 'category',
    operator: 'equals',
    value: '',
};

function ensureArray(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map(String);
    }

    if (value === null || value === undefined) {
        return [];
    }

    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function RuleBuilder({ value, onChange, ruleOptions, disabled = false, error }: RuleBuilderProps) {
    const rules = value.length ? value : [defaultRule];

    const updateRule = (index: number, key: keyof PromotionRule, newValue: unknown) => {
        const next = [...rules];
        next[index] = {
            ...next[index],
            [key]: newValue,
        };

        // Reset operator/value when type changes for cleaner UX
        if (key === 'type') {
            next[index].operator = 'equals';
            next[index].value = '';
        }

        onChange(next);
    };

    const removeRule = (index: number) => {
        if (disabled) return;
        const next = rules.filter((_, i) => i !== index);
        onChange(next.length ? next : [defaultRule]);
    };

    const addRule = () => {
        if (disabled) return;
        onChange([...rules, { ...defaultRule }]);
    };

    const renderValueInput = (rule: PromotionRule, index: number) => {
        const operator = rule.operator || 'equals';

        if (rule.type === 'price_range' && operator === 'between') {
            const current = (rule.value as { min?: number; max?: number }) || {};
            return (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        disabled={disabled}
                        value={current.min ?? ''}
                        onChange={(event) =>
                            updateRule(index, 'value', {
                                ...current,
                                min: event.target.value ? Number(event.target.value) : undefined,
                            })
                        }
                        placeholder="Min"
                        className="rule-input"
                    />
                    <span style={{ color: 'var(--dark-grey)' }}>to</span>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        disabled={disabled}
                        value={current.max ?? ''}
                        onChange={(event) =>
                            updateRule(index, 'value', {
                                ...current,
                                max: event.target.value ? Number(event.target.value) : undefined,
                            })
                        }
                        placeholder="Max"
                        className="rule-input"
                    />
                </div>
            );
        }

        if (operator === 'contains') {
            const current = ensureArray(rule.value);
            return (
                <input
                    type="text"
                    disabled={disabled}
                    value={current.join(', ')}
                    onChange={(event) =>
                        updateRule(index, 'value', ensureArray(event.target.value))
                    }
                    placeholder="value1, value2, value3"
                    className="rule-input"
                />
            );
        }

        const inputType = rule.type === 'price_range' ? 'number' : 'text';

        const displayValue = typeof rule.value === 'number'
            ? rule.value
            : typeof rule.value === 'string'
                ? rule.value
                : '';

        return (
            <input
                type={inputType}
                min={inputType === 'number' ? 0 : undefined}
                step={inputType === 'number' ? '0.01' : undefined}
                disabled={disabled}
                value={displayValue}
                onChange={(event) =>
                    updateRule(index, 'value',
                        inputType === 'number' && event.target.value !== ''
                            ? Number(event.target.value)
                            : event.target.value
                    )
                }
                placeholder="Enter value"
                className="rule-input"
            />
        );
    };

    return (
        <div className="rule-builder">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, color: 'var(--dark)', fontSize: '15px' }}>Rule Builder</h4>
                <button
                    type="button"
                    onClick={addRule}
                    disabled={disabled}
                    className="btn btn-secondary"
                >
                    + Add Rule
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rules.map((rule, index) => (
                    <div
                        key={`rule-${index}`}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 2fr auto',
                            gap: '12px',
                            alignItems: 'center',
                            background: 'var(--light)',
                            borderRadius: '8px',
                            padding: '12px',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <select
                            value={rule.type}
                            disabled={disabled}
                            onChange={(event) => updateRule(index, 'type', event.target.value)}
                            className="rule-select"
                        >
                            {ruleOptions.types.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace('_', ' ')}
                                </option>
                            ))}
                        </select>

                        <select
                            value={rule.operator || 'equals'}
                            disabled={disabled}
                            onChange={(event) => updateRule(index, 'operator', event.target.value)}
                            className="rule-select"
                        >
                            {ruleOptions.operators.map((operator) => (
                                <option key={operator} value={operator}>
                                    {operator.replace('_', ' ')}
                                </option>
                            ))}
                        </select>

                        {renderValueInput(rule, index)}

                        <button
                            type="button"
                            onClick={() => removeRule(index)}
                            disabled={disabled || rules.length === 1}
                            className="btn btn-icon"
                        >
                            <i className="bx bx-trash" />
                        </button>
                    </div>
                ))}
            </div>

            {error && <InputError message={error} />}
        </div>
    );
}
