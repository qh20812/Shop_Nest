import React from 'react';
import { SkeletonCard } from './SkeletonCard';

export const SkeletonFlashSale: React.FC = () => {
    return (
        <section className="mb-12 animate-pulse rounded-xl bg-card p-6 md:mb-16 md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="h-8 w-48 rounded-md bg-muted" />
                <div className="h-10 w-64 rounded-md bg-muted" />
            </div>
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} variant="flash-sale" />
                ))}
            </div>
        </section>
    );
};

export default SkeletonFlashSale;
