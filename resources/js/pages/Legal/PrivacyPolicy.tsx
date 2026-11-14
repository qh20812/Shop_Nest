import { Head } from '@inertiajs/react';

import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { LegalDocument } from '@/components/storefront/LegalDocument';

export default function PrivacyPolicy() {
    return (
        <StorefrontLayout compactFooter>
            <Head title="Chính sách bảo mật" />

            <LegalDocument
                title="Privacy Policy"
                description="How ShopNest collects, uses, and protects your personal information."
                sections={[
                    {
                        heading: '1. Information We Collect',
                        body: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
                    },
                    {
                        heading: '2. How We Use Your Information',
                        body: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.',
                    },
                    {
                        heading: '3. Information Sharing',
                        body: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.',
                    },
                    {
                        heading: '4. Data Security',
                        body: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
                    },
                    {
                        heading: '5. Your Rights',
                        body: 'You have the right to access, update, or delete your personal information. Contact us to exercise these rights.',
                    },
                    {
                        heading: '6. Contact Us',
                        body: 'If you have any questions about this Privacy Policy, please contact us at hotro@shopnest.vn.',
                    },
                ]}
            />
        </StorefrontLayout>
    );
}
