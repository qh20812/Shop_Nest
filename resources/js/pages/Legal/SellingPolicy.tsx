import { Head } from '@inertiajs/react';

import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { LegalDocument } from '@/components/storefront/LegalDocument';

export default function SellingPolicy() {
    return (
        <StorefrontLayout compactFooter>
            <Head title="Chính sách người bán" />

            <LegalDocument
                title="Selling Policy"
                description="Rules and guidelines for sellers using the ShopNest platform."
                sections={[
                    {
                        heading: '1. Seller Eligibility',
                        body: 'To become a seller on ShopNest, you must be at least 18 years old and have the legal right to conduct business in your jurisdiction.',
                    },
                    {
                        heading: '2. Product Listings',
                        body: 'All products must be accurately described, legally obtainable, and comply with our prohibited items policy.',
                    },
                    {
                        heading: '3. Pricing and Fees',
                        body: 'Sellers are responsible for setting competitive prices. ShopNest may charge fees for successful transactions.',
                    },
                    {
                        heading: '4. Order Fulfillment',
                        body: 'Sellers must fulfill orders promptly and accurately. Failure to do so may result in account suspension.',
                    },
                    {
                        heading: '5. Customer Service',
                        body: 'Sellers are expected to provide excellent customer service and handle returns and refunds professionally.',
                    },
                    {
                        heading: '6. Prohibited Activities',
                        body: 'Sellers may not engage in fraudulent activities, spam, or violate intellectual property rights.',
                    },
                    {
                        heading: '7. Account Termination',
                        body: 'ShopNest reserves the right to terminate seller accounts that violate these policies.',
                    },
                ]}
            />
        </StorefrontLayout>
    );
}
