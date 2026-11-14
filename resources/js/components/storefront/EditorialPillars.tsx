import { PageContainer } from '@/components/layout/PageContainer';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type EditorialPillar = {
    eyebrow: string;
    title: string;
    description: string;
    image?: string;
};

type EditorialPillarsProps = {
    pillars: EditorialPillar[];
    className?: string;
};

const spans = ['lg:col-span-5', 'lg:col-span-3', 'lg:col-span-4'];

export function EditorialPillars({ pillars, className }: EditorialPillarsProps) {
    return (
        <section className={cn('py-10 md:py-16', className)}>
            <PageContainer>
                <div className="mb-8 flex flex-col gap-2">
                    <Eyebrow tone="accent">Cách chợ vận hành</Eyebrow>
                    <Heading level={2} size="headline-2">
                        Tuyển chọn kỹ, sống thật êm
                    </Heading>
                </div>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
                    {pillars.slice(0, 3).map((pillar, index) => (
                        <article key={pillar.title} className={cn('flex flex-col gap-4 border-t border-border pt-5', spans[index])}>
                            <span className="font-mono text-label-code text-lacquer-red">0{index + 1}</span>
                            {pillar.image && (
                                <div className="aspect-[4/3] overflow-hidden rounded-card border border-border bg-raw-linen">
                                    <img src={pillar.image} alt="" loading="lazy" className="size-full object-cover" />
                                </div>
                            )}
                            <Eyebrow tone="muted">{pillar.eyebrow}</Eyebrow>
                            <Heading level={3} size="headline-3">
                                {pillar.title}
                            </Heading>
                            <Text size="body-sm" tone="muted">
                                {pillar.description}
                            </Text>
                        </article>
                    ))}
                </div>
            </PageContainer>
        </section>
    );
}

export type { EditorialPillar, EditorialPillarsProps };
export default EditorialPillars;
