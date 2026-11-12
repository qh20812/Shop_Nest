import React from 'react';

interface SkeletonCardProps {
    className?: string;
    variant?: 'default' | 'product' | 'flash-sale' | 'category';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '', variant = 'default' }) => {
    if (variant === 'product') {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="aspect-square rounded-lg bg-card" />
                <div className="mt-4 space-y-3">
                    <div className="h-4 rounded bg-card" />
                    <div className="h-4 w-1/2 rounded bg-card" />
                </div>
            </div>
        );
    }

    if (variant === 'flash-sale') {
        return (
            <div className="w-[260px] min-w-[260px] animate-pulse">
                <div className="aspect-square w-full rounded-t-lg bg-muted" />
                <div className="space-y-3 p-4">
                    <div className="h-4 rounded bg-muted" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
            </div>
        );
    }

    if (variant === 'category') {
        return <div className={`h-32 animate-pulse rounded-lg bg-card ${className}`} />;
    }

    return (
        <div className={`animate-pulse ${className}`}>
            <div className="h-full w-full rounded bg-card" />
        </div>
    );
};

export default SkeletonCard;
