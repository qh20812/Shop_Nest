import React from 'react';
import { router, usePage } from '@inertiajs/react';
import vietnamCurrencyIcon from '../../../../public/vnd-currency.svg?url';
import dollarCurrencyIcon from '../../../../public/dollar-currency.svg?url';

interface CurrencyOption {
  value: string;
  label: string;
  icon: string;
}

const CURRENCY_ROUTE = '/currency';

type CurrencyPageProps = {
  currency?:
    | string
    | {
        code?: string;
      };
};

export default function CurrencyDropdown() {
  const { props } = usePage<CurrencyPageProps>();
  const derivedCurrency = React.useMemo(() => {
    const source = props.currency;

    if (typeof source === 'string' && source.trim() !== '') {
      return source.toUpperCase();
    }

    if (source && typeof source === 'object' && typeof source.code === 'string') {
      return source.code.toUpperCase();
    }

    return 'VND';
  }, [props.currency]);

  const [currentCurrency, setCurrentCurrency] = React.useState<string>(derivedCurrency);
  const [isHovering, setIsHovering] = React.useState(false);

  const currencyOptions: CurrencyOption[] = React.useMemo(() => (
    [
      { value: 'VND', label: 'VND', icon: vietnamCurrencyIcon },
      { value: 'USD', label: 'USD', icon: dollarCurrencyIcon },
    ]
  ), []);

  React.useEffect(() => {
    setCurrentCurrency(derivedCurrency);
  }, [derivedCurrency]);

  const activeOption = currencyOptions.find((option) => option.value === currentCurrency) ?? currencyOptions[0];

  const switchCurrency = (newCurrency: string) => {
    const normalized = newCurrency.toUpperCase();

    if (normalized && normalized !== currentCurrency) {
      const previousCurrency = currentCurrency;
      setCurrentCurrency(normalized);

      router.post(CURRENCY_ROUTE, { currency: normalized }, {
        preserveState: true,
        preserveScroll: true,
        onError: () => setCurrentCurrency(previousCurrency),
      });
    }
  };

  const visibleTriggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    background: isHovering ? 'var(--light-primary)' : 'var(--primary)',
    color: isHovering ? 'var(--primary)' : '#ffffff',
    transition: 'all 0.3s ease',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    minWidth: '140px',
    justifyContent: 'space-between',
  };

  const arrowStyle: React.CSSProperties = {
    display: 'inline-block',
    marginLeft: '12px',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: isHovering ? '6px solid var(--primary)' : '6px solid #ffffff',
    transition: 'border-color 0.3s ease',
  };

  const selectStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div style={visibleTriggerStyle}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={activeOption.icon}
              alt={activeOption.label}
              style={{ width: '18px', height: '18px', borderRadius: '999px', objectFit: 'cover' }}
            />
            <span>{activeOption.label}</span>
          </span>
          <span style={arrowStyle} />
        </div>
        <select
          value={currentCurrency}
          onChange={(event) => switchCurrency(event.target.value)}
          style={selectStyle}
          aria-label="Select currency"
        >
          {currencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
