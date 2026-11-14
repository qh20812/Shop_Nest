import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';

type LegalSection = {
    heading: string;
    body: React.ReactNode;
};

type LegalDocumentProps = {
    title: string;
    description: string;
    sections: LegalSection[];
};

export function LegalDocument({ title, description, sections }: LegalDocumentProps) {
    return (
        <PageContainer size="prose" className="py-section">
            <PageHeader eyebrow="Pháp lý" title={title} description={description} />
            <Card className="mt-8" padding="lg">
                <div className="flex flex-col gap-8">
                    {sections.map((section) => (
                        <section key={section.heading}>
                            <Heading level={2} size="headline-3">
                                {section.heading}
                            </Heading>
                            <Text size="body-md" tone="muted" className="mt-2">
                                {section.body}
                            </Text>
                        </section>
                    ))}
                </div>
            </Card>
        </PageContainer>
    );
}

export type { LegalDocumentProps, LegalSection };
export default LegalDocument;
