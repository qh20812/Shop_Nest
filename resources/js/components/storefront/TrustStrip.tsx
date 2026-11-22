import type { LucideIcon } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { cx } from '@/lib/cx';

import styles from './storefront.module.css';

type TrustItem = {
    icon: LucideIcon;
    title: string;
    description: string;
};

type TrustStripProps = {
    items: TrustItem[];
    className?: string;
};

export function TrustStrip({ items, className }: TrustStripProps) {
    return (
        <section className={cx(styles.trustStrip, className)}>
            <PageContainer>
                <div className={styles.trustGrid}>
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div key={item.title} className={styles.trustItem}>
                                <span className={styles.trustIconBox}>
                                    <Icon aria-hidden="true" className={styles.trustIcon} />
                                </span>
                                <div>
                                    <h3 className={styles.trustTitle}>{item.title}</h3>
                                    <p className={styles.trustText}>{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PageContainer>
        </section>
    );
}

export type { TrustItem, TrustStripProps };
export default TrustStrip;
