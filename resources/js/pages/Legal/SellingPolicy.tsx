import React from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '@/layouts/app/HomeLayout';

export default function SellingPolicy() {
    return (
        <HomeLayout>
            <Head title="Selling Policy" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Selling Policy</h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-600 mb-6">
                                This Selling Policy outlines the rules and guidelines for sellers using the ShopNest platform.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Seller Eligibility</h2>
                            <p className="text-gray-600 mb-4">
                                To become a seller on ShopNest, you must be at least 18 years old and have the legal right to conduct business in your jurisdiction.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Product Listings</h2>
                            <p className="text-gray-600 mb-4">
                                All products must be accurately described, legally obtainable, and comply with our prohibited items policy.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Pricing and Fees</h2>
                            <p className="text-gray-600 mb-4">
                                Sellers are responsible for setting competitive prices. ShopNest may charge fees for successful transactions.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Order Fulfillment</h2>
                            <p className="text-gray-600 mb-4">
                                Sellers must fulfill orders promptly and accurately. Failure to do so may result in account suspension.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Customer Service</h2>
                            <p className="text-gray-600 mb-4">
                                Sellers are expected to provide excellent customer service and handle returns and refunds professionally.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Prohibited Activities</h2>
                            <p className="text-gray-600 mb-4">
                                Sellers may not engage in fraudulent activities, spam, or violate intellectual property rights.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Account Termination</h2>
                            <p className="text-gray-600 mb-4">
                                ShopNest reserves the right to terminate seller accounts that violate these policies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}