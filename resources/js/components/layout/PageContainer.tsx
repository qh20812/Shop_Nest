import * as React from 'react';

import { cn } from '@/lib/utils';

type PageContainerProps = React.ComponentProps<'div'> & {
    size?: 'page' | 'prose' | 'narrow' | 'full';
    as?: 'div' | 'section' | 'main';
};

const sizeClasses = {
    page: 'max-w-page',
    prose: 'max-w-prose',
    narrow: 'max-w-3xl',
    full: 'max-w-none',
};

export function PageContainer({ className, size = 'page', as: Comp = 'div', ...props }: PageContainerProps) {
    return <Comp className={cn('mx-auto w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter', sizeClasses[size], className)} {...props} />;
}

export default PageContainer;
