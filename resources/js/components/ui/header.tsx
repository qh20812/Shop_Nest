import { Button } from '@/components/ui/button';
import type { BreadcrumbItem as BreadcrumbsItem } from '@/components/ui/breadcrumbs';
import PageHeader from '@/components/layout/PageHeader';
import { renderIcon, type IconProp } from '@/lib/icon';

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface HeadProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    reportButton?: {
        label: string;
        icon: IconProp;
        onClick?: () => void;
    };
}

export default function Header({ title, breadcrumbs, reportButton }: HeadProps) {
    const items: BreadcrumbsItem[] = breadcrumbs.map((item) => ({
        label: item.label,
        href: item.href,
        current: item.active || !item.href,
    }));

    const actions = reportButton ? (
        <Button variant="secondary" size="sm" onClick={reportButton.onClick}>
            {renderIcon(reportButton.icon)}
            <span>{reportButton.label}</span>
        </Button>
    ) : undefined;

    return <PageHeader title={title} breadcrumbs={items.length > 0 ? items : undefined} actions={actions} />;
}
