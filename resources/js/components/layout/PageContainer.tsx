import * as React from 'react';

import { cx } from '@/lib/cx';

type PageContainerProps = React.ComponentProps<'div'> & {
    size?: 'page' | 'prose' | 'narrow' | 'full';
    as?: 'div' | 'section' | 'main';
};

export function PageContainer({ className, size = 'page', as: Comp = 'div', ...props }: PageContainerProps) {
    return <Comp className={cx(size === 'page' ? 'sn-container' : 'sn-page-container', className)} data-size={size} {...props} />;
}

export default PageContainer;
