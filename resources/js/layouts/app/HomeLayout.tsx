import React from 'react';

import { StorefrontLayout } from '@/components/layout/StorefrontLayout';

interface HomeLayoutProps {
    children: React.ReactNode;
}

/**
 * Compatibility wrapper for pages that have not been migrated yet.
 * New storefront pages should import StorefrontLayout directly.
 */
export default function HomeLayout({ children }: HomeLayoutProps) {
    return <StorefrontLayout compactFooter>{children}</StorefrontLayout>;
}
