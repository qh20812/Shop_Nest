import React from 'react';

export const SkeletonHero: React.FC = () => {
    return (
        <section className="mb-12 md:mb-16">
            <div className="w-full h-[500px] rounded-xl bg-card animate-pulse" />
        </section>
    );
};

export default SkeletonHero;
