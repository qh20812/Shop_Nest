import { Link } from '@inertiajs/react';
import { ArrowRight, Baby, CookingPot, Laptop, Shirt, Sofa, Sparkles, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { TextLink } from '@/components/ui/text-link';
import { cx } from '@/lib/cx';

import styles from './storefront.module.css';

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
        <section id="danh-muc" className={cx(styles.categoryShelf, className)}>
            <PageContainer>
                <SectionHeader
                    eyebrow="Sáu nhóm ngành"
                    title={title}
                    action={
                        action ?? (
                            <TextLink href="/search" tone="muted" underline={false}>
                                Tất cả danh mục
                                <ArrowRight aria-hidden="true" className={styles.inlineIcon} />
                            </TextLink>
                        )
                    }
                />
                <div className={styles.categoryGrid}>
                    {items.map((category) => {
                        const Icon = getCategoryIcon(category.name);

                        return (
                            <Link key={`${category.id ?? category.name}`} href={getCategoryHref(category)} className={styles.categoryTile}>
                                <div className={styles.categoryMedia}>
                                    {category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name} loading="lazy" className={styles.categoryImage} />
                                    ) : (
                                        <Icon aria-hidden="true" className={styles.categoryIcon} />
                                    )}
                                </div>
                                <h3 className={styles.categoryName}>{category.name}</h3>
                                <span className={styles.categoryMeta}>Xem món</span>
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
