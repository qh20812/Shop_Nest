import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type TimelineStep = {
    key: string;
    label: string;
    description?: string;
    timestamp?: string;
};

type OrderTimelineProps = {
    steps: TimelineStep[];
    current: number;
    tone?: 'default' | 'cancelled' | 'returned';
    className?: string;
};

export function OrderTimeline({ steps, current, tone = 'default', className }: OrderTimelineProps) {
    return (
        <ol className={cx(styles.timeline, className)} data-tone={tone} aria-label="Tiến trình đơn hàng">
            {steps.map((step, index) => {
                const state = index < current ? 'done' : index === current ? 'active' : 'pending';
                const isLast = index === steps.length - 1;

                return (
                    <li key={step.key} className={styles.timelineItem} data-state={state}>
                        <div className={styles.timelineTrack} aria-hidden="true">
                            <span className={styles.timelineMarker} />
                            {!isLast && <span className={styles.timelineLine} />}
                        </div>
                        <div className={styles.timelineContent}>
                            <span className={styles.timelineLabel}>{step.label}</span>
                            {step.description ? <span className={styles.timelineDescription}>{step.description}</span> : null}
                            {step.timestamp ? <span className={styles.timelineTimestamp}>{step.timestamp}</span> : null}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export type { OrderTimelineProps, TimelineStep };
export default OrderTimeline;
