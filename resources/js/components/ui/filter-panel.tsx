import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Header from '@/components/ui/header';
import { renderIcon, type IconProp } from '@/lib/icon';
import { useTranslation } from '@/lib/i18n';

interface Breadcrumb {
    label: string;
    href: string;
    active?: boolean;
}

interface SearchConfig {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

interface FilterDropdownConfig {
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: { value: string | number; label: string }[];
}

interface ActionButtonConfig {
    href: string;
    label: string;
    icon: IconProp;
    color: 'primary' | 'success' | 'danger';
}

interface FilterPanelProps {
    title: string;
    breadcrumbs: Breadcrumb[];
    onApplyFilters: () => void;
    searchConfig?: SearchConfig;
    filterConfigs?: FilterDropdownConfig[];
    buttonConfigs?: ActionButtonConfig[];
    reportButtonConfig?: {
        label: string;
        icon: IconProp;
        onClick: () => void;
    };
}

const buttonVariant = (color: ActionButtonConfig['color']) => (color === 'danger' ? 'destructive' : 'primary');

/**
 * Legacy Admin filter bar. Icon props accept Lucide components (Seller) or the
 * bare Boxicons names Admin still passes until Phase 8.
 */
function configIcon(icon: IconProp) {
    return renderIcon(icon);
}

export default function FilterPanel({
    title,
    breadcrumbs,
    onApplyFilters,
    searchConfig,
    filterConfigs = [],
    buttonConfigs = [],
    reportButtonConfig,
}: FilterPanelProps) {
    const { t } = useTranslation();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onApplyFilters();
    };

    return (
        <>
            <Header
                title={t(title)}
                breadcrumbs={breadcrumbs.map((crumb) => ({
                    ...crumb,
                    label: t(crumb.label),
                }))}
                reportButton={reportButtonConfig}
            />

            <form className="sn-filter-panel" onSubmit={handleSubmit}>
                <div className="sn-filter-panel__grid">
                    {searchConfig && (
                        <div className="sn-filter-panel__search">
                            <Input
                                type="search"
                                value={searchConfig.value}
                                onChange={(event) => searchConfig.onChange(event.target.value)}
                                placeholder={t(searchConfig.placeholder)}
                                aria-label={t(searchConfig.placeholder)}
                                leadingIcon={Search}
                            />
                            <Button type="submit" variant="secondary" size="md">
                                {t('Search')}
                            </Button>
                        </div>
                    )}

                    {filterConfigs.map((filterConfig, index) => (
                        <div key={index} className="sn-filter-panel__field">
                            <Select
                                value={filterConfig.value}
                                onChange={(event) => filterConfig.onChange(event.target.value)}
                                aria-label={t(filterConfig.label)}
                            >
                                <option value="">{t(filterConfig.label)}</option>
                                {filterConfig.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {t(option.label)}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    ))}

                    {buttonConfigs.map((buttonConfig, index) => (
                        <Button asChild key={index} variant={buttonVariant(buttonConfig.color)} size="md">
                            <Link href={buttonConfig.href}>
                                {configIcon(buttonConfig.icon)}
                                {t(buttonConfig.label)}
                            </Link>
                        </Button>
                    ))}
                </div>
            </form>
        </>
    );
}
