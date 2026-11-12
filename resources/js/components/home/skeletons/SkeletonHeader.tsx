import React from 'react';

export const SkeletonHeader: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between whitespace-nowrap">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 animate-pulse rounded-md bg-card" />
                            <div className="h-6 w-24 animate-pulse rounded-md bg-card" />
                        </div>
                        <nav className="hidden items-center gap-9 md:flex">
                            <div className="h-4 w-20 animate-pulse rounded-md bg-card" />
                            <div className="h-4 w-20 animate-pulse rounded-md bg-card" />
                            <div className="h-4 w-20 animate-pulse rounded-md bg-card" />
                            <div className="h-4 w-20 animate-pulse rounded-md bg-card" />
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-4">
                        <div className="hidden h-10 w-64 animate-pulse rounded-lg bg-card lg:flex" />
                        <div className="flex gap-2">
                            <div className="h-10 w-10 animate-pulse rounded-lg bg-card" />
                            <div className="h-10 w-10 animate-pulse rounded-lg bg-card" />
                        </div>
                        <div className="size-10 animate-pulse rounded-full bg-card" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SkeletonHeader;
