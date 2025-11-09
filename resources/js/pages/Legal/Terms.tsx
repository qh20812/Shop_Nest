import React from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '@/layouts/app/HomeLayout';

export default function Terms() {
    return (
        <HomeLayout>
            <Head title="Terms of Service" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-600 mb-6">
                                Welcome to ShopNest. These Terms of Service govern your use of our platform.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 mb-4">
                                By accessing and using ShopNest, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
                            <p className="text-gray-600 mb-4">
                                Permission is granted to temporarily use ShopNest for personal and business use.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
                            <p className="text-gray-600 mb-4">
                                Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Prohibited Uses</h2>
                            <p className="text-gray-600 mb-4">
                                You may not use our service for any illegal or unauthorized purpose.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Termination</h2>
                            <p className="text-gray-600 mb-4">
                                We may terminate or suspend your account immediately for any reason.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Information</h2>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about these Terms, please contact us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}