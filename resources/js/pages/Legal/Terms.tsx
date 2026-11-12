import HomeLayout from '@/layouts/app/HomeLayout';
import { Head } from '@inertiajs/react';

export default function Terms() {
    return (
        <HomeLayout>
            <Head title="Terms of Service" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-lg">
                        <h1 className="mb-8 text-3xl font-bold text-gray-900">Terms of Service</h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="mb-6 text-gray-600">Welcome to ShopNest. These Terms of Service govern your use of our platform.</p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
                            <p className="mb-4 text-gray-600">
                                By accessing and using ShopNest, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">2. Use License</h2>
                            <p className="mb-4 text-gray-600">Permission is granted to temporarily use ShopNest for personal and business use.</p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">3. User Responsibilities</h2>
                            <p className="mb-4 text-gray-600">
                                Users are responsible for maintaining the confidentiality of their account information and for all activities that
                                occur under their account.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">4. Prohibited Uses</h2>
                            <p className="mb-4 text-gray-600">You may not use our service for any illegal or unauthorized purpose.</p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">5. Termination</h2>
                            <p className="mb-4 text-gray-600">We may terminate or suspend your account immediately for any reason.</p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">6. Contact Information</h2>
                            <p className="mb-4 text-gray-600">If you have any questions about these Terms, please contact us.</p>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
