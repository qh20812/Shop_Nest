import { Link } from '@inertiajs/react';
import { ArrowRight, Baby, CookingPot, Laptop, Shirt, Sofa, Sparkles, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { TextLink } from '@/components/ui/text-link';
import { cn } from '@/lib/utils';

type CategoryItem = {
    id?: number | string | null;
    name: string;
    imageUrl?: string | null;
    icon?: string | null;
};

type CategoryShelfProps = {
    categories?: CategoryItem[];
    title?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
};

const fallbackCategories: CategoryItem[] = [
    { name: 'Điện tử & công nghệ' },
    { name: 'Gia dụng & nhà bếp' },
    { name: 'Nhà cửa & trang trí' },
    { name: 'Mẹ & bé' },
    { name: 'Thời trang & phụ kiện' },
    { name: 'Làm đẹp & chăm sóc' },
];

function getCategoryIcon(name: string): LucideIcon {
    const normalized = name.toLowerCase();

    if (/điện tử|electronics|tech|công nghệ/.test(normalized)) return Laptop;
    if (/gia dụng|bếp|kitchen|nồi/.test(normalized)) return CookingPot;
    if (/nhà cửa|trang trí|home|living/.test(normalized)) return Sofa;
    if (/mẹ|bé|baby|trẻ/.test(normalized)) return Baby;
    if (/thời trang|fashion|quần áo|phụ kiện/.test(normalized)) return Shirt;

    return Sparkles;
}

function getCategoryHref(category: CategoryItem): string {
    return category.id ? `/search?category_ids[]=${category.id}` : `/search?search=${encodeURIComponent(category.name)}`;
}

export function CategoryShelf({ categories = [], title = 'Danh mục chủ lực', action, className }: CategoryShelfProps) {
    const items = (categories.length > 0 ? categories : fallbackCategories).slice(0, 6);

    return (
        <section id="danh-muc" className={cn('py-10 md:py-14', className)}>
            <PageContainer>
                <SectionHeader
                    eyebrow="Hệ thống sản phẩm"
                    title={title}
                    action={
                        action ?? (
                            <TextLink href="/search" tone="muted" underline={false}>
                                Tất cả danh mục
                                <ArrowRight aria-hidden="true" className="size-4" />
                            </TextLink>
                        )
                    }
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {items.map((category) => {
                        const Icon = getCategoryIcon(category.name);

                        return (
                            <Link
                                key={`${category.id ?? category.name}`}
                                href={getCategoryHref(category)}
                                className="group focus-ring flex flex-col rounded-card border border-border bg-warm-porcelain p-3 transition-colors duration-150 ease-nep hover:border-lacquer-red"
                            >
                                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-card bg-raw-linen">
                                    {category.imageUrl ? (
                                        <img
                                            src={category.imageUrl}
                                            alt={category.name}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <span className="flex size-full items-center justify-center text-ink-muted">
                                            <Icon aria-hidden="true" className="size-8" />
                                        </span>
                                    )}
                                </div>
                                <h3 className="line-clamp-2 text-body-md font-semibold text-ink transition-colors group-hover:text-lacquer-red">
                                    {category.name}
                                </h3>
                                <span className="mt-1 font-mono text-label-code text-ink-faint">Xem món</span>
                            </Link>
                        );
                    })}
                </div>
            </PageContainer>
        </section>
    );
}

export type { CategoryItem, CategoryShelfProps };
export default CategoryShelf;
