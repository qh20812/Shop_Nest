import HomeLayout from '@/layouts/app/HomeLayout';
import { Head } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <HomeLayout>
            <Head title="Privacy Policy" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-lg">
                        <h1 className="mb-8 text-3xl font-bold text-gray-900">Privacy Policy</h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="mb-6 text-gray-600">
                                This Privacy Policy describes how ShopNest collects, uses, and protects your personal information.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
                            <p className="mb-4 text-gray-600">
                                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us
                                for support.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
                            <p className="mb-4 text-gray-600">
                                We use the information we collect to provide, maintain, and improve our services, process transactions, and
                                communicate with you.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">3. Information Sharing</h2>
                            <p className="mb-4 text-gray-600">
                                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except
                                as described in this policy.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">4. Data Security</h2>
                            <p className="mb-4 text-gray-600">
                                We implement appropriate security measures to protect your personal information against unauthorized access,
                                alteration, disclosure, or destruction.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">5. Your Rights</h2>
                            <p className="mb-4 text-gray-600">
                                You have the right to access, update, or delete your personal information. Contact us to exercise these rights.
                            </p>

                            <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">6. Contact Us</h2>
                            <p className="mb-4 text-gray-600">If you have any questions about this Privacy Policy, please contact us.</p>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
