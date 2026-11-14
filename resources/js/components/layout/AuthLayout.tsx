import { Link } from '@inertiajs/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { AuthBrandPanel } from './AuthBrandPanel';

type AuthLayoutProps = {
    children: React.ReactNode;
    variant?: 'split' | 'centered';
    brand?: React.ReactNode;
    className?: string;
};

export function AuthLayout({ children, variant = 'split', brand, className }: AuthLayoutProps) {
    if (variant === 'centered') {
        return (
            <div className={cn('flex min-h-[100dvh] flex-col bg-rice-paper', className)}>
                <div className="flex justify-center px-gutter-mobile pt-8 md:pt-10">
                    <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-chip">
                        <img src="/image/ShopnestLogo.png" alt="ShopNest" className="size-10 object-contain" />
                        <span className="text-headline-3 font-semibold text-ink">ShopNest</span>
                    </Link>
                </div>
                <main className="flex flex-1 items-center justify-center px-gutter-mobile py-10 md:px-gutter">
                    <div className="w-full max-w-md">{children}</div>
                </main>
            </div>
        );
    }

    return (
        <div className={cn('grid min-h-[100dvh] bg-rice-paper lg:grid-cols-12', className)}>
            <div className="hidden lg:col-span-5 lg:block">{brand ?? <AuthBrandPanel />}</div>
            <main className="col-span-12 bg-warm-porcelain lg:col-span-7">
                <div className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col justify-center px-gutter-mobile py-10 md:px-gutter lg:px-12">
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <img src="/image/ShopnestLogo.png" alt="ShopNest" className="size-9 object-contain" />
                        <span className="text-headline-3 font-semibold text-ink">ShopNest</span>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;
