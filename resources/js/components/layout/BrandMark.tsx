import type { CSSProperties } from 'react';

import markUrl from '@/assets/brand-mark.png';
import { cx } from '@/lib/cx';

type BrandMarkProps = {
    className?: string;
};

const markStyle = {
    '--sn-brand-mark': `url("${markUrl}")`,
} as CSSProperties;

/**
 * The ShopNest mark. The PNG is used as an alpha mask so the mark always
 * takes `--sn-color-accent` and adapts to light and dark without a second asset.
 * The wordmark next to it carries the accessible name, so the mark is decorative.
 */
export function BrandMark({ className }: BrandMarkProps) {
    return <span aria-hidden="true" className={cx('sn-brand__mark', className)} style={markStyle} />;
}

export default BrandMark;
