import { Head } from '@inertiajs/react';

import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { LegalDocument } from '@/components/storefront/LegalDocument';

export default function Terms() {
    return (
        <StorefrontLayout compactFooter>
            <Head title="Điều khoản sử dụng" />

            <LegalDocument
                title="Terms of Service"
                description="These terms govern your use of the ShopNest platform."
                sections={[
                    {
                        heading: '1. Acceptance of Terms',
                        body: 'By accessing and using ShopNest, you accept and agree to be bound by the terms and provision of this agreement.',
                    },
                    {
                        heading: '2. Use License',
                        body: 'Permission is granted to temporarily use ShopNest for personal and business use.',
                    },
                    {
                        heading: '3. User Responsibilities',
                        body: 'Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.',
                    },
                    {
                        heading: '4. Prohibited Uses',
                        body: 'You may not use our service for any illegal or unauthorized purpose.',
                    },
                    {
                        heading: '5. Termination',
                        body: 'We may terminate or suspend your account immediately for any reason.',
                    },
                    {
                        heading: '6. Contact Information',
                        body: 'If you have any questions about these Terms, please contact us at hotro@shopnest.vn.',
                    },
                ]}
            />
        </StorefrontLayout>
    );
}
