import { Link } from '@inertiajs/react';
import { ArrowRight, Store } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type BrandSpotlightProps = {
    eyebrow?: string;
    title?: string;
    description?: string;
    cta?: { label: string; href: string };
    image?: string;
    className?: string;
};

export function BrandSpotlight({
    eyebrow = 'Shop Việt',
    title = 'Người bán thật, nguồn gốc thật.',
    description = 'Mỗi shop trên ShopNest được kiểm duyệt hồ sơ, nguồn hàng và chính sách đổi trả trước khi mở bán.',
    cta = { label: 'Khám phá Shop Việt', href: '/search' },
    image = 'https://picsum.photos/seed/shopnest-shop-viet/1200/800',
    className,
}: BrandSpotlightProps) {
    return (
        <section id="shop-viet" className={cn('py-10 md:py-14', className)}>
            <PageContainer>
                <div className="grid overflow-hidden rounded-surface border border-border bg-raw-linen/50 lg:grid-cols-12">
                    <div className="flex flex-col justify-center gap-4 p-6 md:p-10 lg:col-span-7">
                        <Badge tone="accent" icon={Store} size="md" className="w-fit">
                            {eyebrow}
                        </Badge>
                        <Eyebrow tone="muted">Tuyển chọn nhà bán</Eyebrow>
                        <Heading level={2} size="headline-1" className="max-w-[18ch]">
                            {title}
                        </Heading>
                        <Text size="body-md" tone="muted" className="max-w-[52ch]">
                            {description}
                        </Text>
                        <Button asChild variant="secondary" rightIcon={ArrowRight} className="mt-2 w-fit">
                            <Link href={cta.href}>{cta.label}</Link>
                        </Button>
                    </div>
                    <div className="relative min-h-64 lg:col-span-5">
                        <img src={image} alt="Gian hàng Shop Việt" loading="lazy" className="size-full object-cover" />
                    </div>
                </div>
            </PageContainer>
        </section>
    );
}

export type { BrandSpotlightProps };
export default BrandSpotlight;
