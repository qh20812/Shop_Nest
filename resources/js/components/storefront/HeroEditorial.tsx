import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type HeroImage = {
    src: string;
    alt: string;
    label?: string;
};

type HeroEditorialProps = {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    subcopy: React.ReactNode;
    cta?: { label: string; href: string };
    images: HeroImage[];
    trust?: string[];
    className?: string;
};

export function HeroInlineImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    return (
        <img
            src={src}
            alt={alt}
            className={cn('mx-1 inline-block h-9 w-16 rounded-control border border-border object-cover align-middle md:h-11 md:w-20', className)}
            loading="eager"
        />
    );
}

export function HeroEditorial({ eyebrow, title, subcopy, cta, images, trust = [], className }: HeroEditorialProps) {
    const [lead, ...rest] = images;

    return (
        <section className={cn('bg-rice-paper pt-8 pb-12 md:pt-12 md:pb-16', className)}>
            <PageContainer>
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-7">
                        <Eyebrow tone="accent">{eyebrow ?? 'Mọi thứ cho tổ ấm Việt'}</Eyebrow>
                        <Heading level={1} size="display-lg" serif className="mt-4 max-w-[15ch] leading-none">
                            {title}
                        </Heading>
                        <Text size="body-lg" tone="muted" className="mt-5 max-w-[46ch]">
                            {subcopy}
                        </Text>

                        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                            {cta && (
                                <Button asChild size="lg" rightIcon={ArrowRight} className="w-full sm:w-auto">
                                    <Link href={cta.href}>{cta.label}</Link>
                                </Button>
                            )}
                            {trust.length > 0 && (
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-ink-muted">
                                    {trust.map((item) => (
                                        <span key={item} className="inline-flex items-center gap-1.5">
                                            <CheckCircle2 aria-hidden="true" className="size-4 text-jade" />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {lead && (
                        <div className="grid grid-cols-2 gap-3 lg:col-span-5">
                            <HeroCell image={lead} wide priority />
                            {rest.slice(0, 2).map((image) => (
                                <HeroCell key={image.src} image={image} />
                            ))}
                        </div>
                    )}
                </div>
            </PageContainer>
        </section>
    );
}

function HeroCell({ image, wide = false, priority = false }: { image: HeroImage; wide?: boolean; priority?: boolean }) {
    return (
        <div className={cn('flex flex-col gap-2', wide && 'col-span-2')}>
            <div className={cn('overflow-hidden rounded-card border border-border bg-raw-linen', wide ? 'aspect-[16/9]' : 'aspect-[4/3]')}>
                <img
                    src={image.src}
                    alt={image.alt}
                    loading={priority ? 'eager' : 'lazy'}
                    className="size-full object-cover transition-transform duration-300 ease-nep hover:scale-[1.02]"
                />
            </div>
            {image.label && <span className="font-mono text-label-code text-ink-faint">{image.label}</span>}
        </div>
    );
}

export type { HeroEditorialProps, HeroImage };
export default HeroEditorial;
