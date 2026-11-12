import React from 'react';

interface SkeletonCardProps {
    className?: string;
    variant?: 'default' | 'product' | 'flash-sale' | 'category';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '', variant = 'default' }) => {
    if (variant === 'product') {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="aspect-square bg-card rounded-lg" />
                <div className="mt-4 space-y-3">
                    <div className="h-4 bg-card rounded" />
                    <div className="h-4 w-1/2 bg-card rounded" />
                </div>
            </div>
        );
    }

    if (variant === 'flash-sale') {
        return (
            <div className="min-w-[260px] w-[260px] animate-pulse">
                <div className="w-full aspect-square bg-muted rounded-t-lg" />
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
            </div>
        );
    }

    if (variant === 'category') {
        return (
            <div className={`h-32 bg-card rounded-lg animate-pulse ${className}`} />
        );
    }

    return (
        <div className={`animate-pulse ${className}`}>
            <div className="h-full w-full bg-card rounded" />
        </div>
    );
};

export default SkeletonCard;
