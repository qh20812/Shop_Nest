import HomeLayout from '@/layouts/app/HomeLayout';
import { Head } from '@inertiajs/react';

export default function SellingPolicy() {
    return (
        <HomeLayout>
            <Head title="Selling Policy" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-lg">
                        <h1 className="mb-8 text-3xl font-bold text-gray-900">Selling Policy</h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="mb-6 text-gray-600">
                                This Selling Policy outlines the rules and guidelines for sellers using the ShopNest platform.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">1. Seller Eligibility</h2>
                            <p className="mb-4 text-gray-600">
                                To become a seller on ShopNest, you must be at least 18 years old and have the legal right to conduct business in your
                                jurisdiction.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">2. Product Listings</h2>
                            <p className="mb-4 text-gray-600">
                                All products must be accurately described, legally obtainable, and comply with our prohibited items policy.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">3. Pricing and Fees</h2>
                            <p className="mb-4 text-gray-600">
                                Sellers are responsible for setting competitive prices. ShopNest may charge fees for successful transactions.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">4. Order Fulfillment</h2>
                            <p className="mb-4 text-gray-600">
                                Sellers must fulfill orders promptly and accurately. Failure to do so may result in account suspension.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">5. Customer Service</h2>
                            <p className="mb-4 text-gray-600">
                                Sellers are expected to provide excellent customer service and handle returns and refunds professionally.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">6. Prohibited Activities</h2>
                            <p className="mb-4 text-gray-600">
                                Sellers may not engage in fraudulent activities, spam, or violate intellectual property rights.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">7. Account Termination</h2>
                            <p className="mb-4 text-gray-600">
                                ShopNest reserves the right to terminate seller accounts that violate these policies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
