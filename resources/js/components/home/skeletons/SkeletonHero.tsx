import React from 'react';

export const SkeletonHero: React.FC = () => {
    return (
        <section className="mb-12 md:mb-16">
            <div className="h-[500px] w-full animate-pulse rounded-xl bg-card" />
        </section>
    );
};

export default SkeletonHero;
