import { ReactNode } from 'react';

import { renderIcon, type IconProp } from '@/lib/icon';

import styles from './shippers.module.css';

interface ShipperInfoCardProps {
    title: string;
    icon?: IconProp;
    children: ReactNode;
    actionButtons?: ReactNode;
}

export default function ShipperInfoCard({ title, icon, children, actionButtons }: ShipperInfoCardProps) {
    return (
        <section className={styles.card}>
            <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>
                    {icon ? <span className={styles.cardIcon}>{renderIcon(icon)}</span> : null}
                    {title}
                </h2>
                {actionButtons ? <div className={styles.cardActions}>{actionButtons}</div> : null}
            </div>
            {children}
        </section>
    );
}
