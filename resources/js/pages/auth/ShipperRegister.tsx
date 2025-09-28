import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import PrimaryInput from '@/components/ui/PrimaryInput';
import InputError from '@/components/ui/InputError';
import ActionButton from '@/components/ui/ActionButton';

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    id_card_number: string;
    driver_license_number: string;
    vehicle_type: string;
    license_plate: string;
    id_card_front: File | null;
    id_card_back: File | null;
    driver_license_front: File | null;
}

export default function ShipperRegister() {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        id_card_number: '',
        driver_license_number: '',
        vehicle_type: '',
        license_plate: '',
        id_card_front: null,
        id_card_back: null,
        driver_license_front: null,
    });

    // State for image previews
    const [previews, setPreviews] = useState<{
        id_card_front?: string;
        id_card_back?: string;
        driver_license_front?: string;
    }>({});

    const handleFileChange = (field: keyof Pick<FormData, 'id_card_front' | 'id_card_back' | 'driver_license_front'>, file: File | null) => {
        setData(field, file);
        
        // Create preview URL
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [field]: previewUrl }));
        } else {
            setPreviews(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/register/shipper', {
            onFinish: () => {
                reset('password', 'password_confirmation');
                // Clean up preview URLs
                Object.values(previews).forEach(url => {
                    if (url) URL.revokeObjectURL(url);
                });
            },
        });
    };

    return (
        <>
            <Head title="Shipper Registration" />
            
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-4xl mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Become a Shipper</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Join our delivery network and start earning. Fill out the application below.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="border-b border-gray-200 pb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <PrimaryInput
                                        label="First Name"
                                        type="text"
                                        name="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        error={errors.first_name}
                                        required
                                    />
                                </div>

                                <div>
                                    <PrimaryInput
                                        label="Last Name"
                                        type="text"
                                        name="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        error={errors.last_name}
                                        required
                                    />
                                </div>

                                <div>
                                    <PrimaryInput
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={errors.email}
                                        required
                                    />
                                </div>

                                <div>
                                    <PrimaryInput
                                        label="Phone Number"
                                        type="text"
                                        name="phone_number"
                                        value={data.phone_number}
                                        placeholder="e.g., 0901234567 or +84901234567"
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        error={errors.phone_number}
                                        required
                                    />
                                </div>

                                <div>
                                    <PrimaryInput
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        error={errors.password}
                                        required
                                    />
                                </div>

                                <div>
                                    <PrimaryInput
                                        label="Confirm Password"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        error={errors.password_confirmation}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipper Information Section */}
                        <div className="border-b border-gray-200 pb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipper Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <PrimaryInput
                                        label="ID Card Number"
                                        type="text"
                                        name="id_card_number"
                                        value={data.id_card_number}
                                        placeholder="e.g., 123456789012"
                                        onChange={(e) => setData('id_card_number', e.target.value)}
                                        error={errors.id_card_number}
                                        required
                                    />
                                </div>

                                <div>
                                    <PrimaryInput
                                        label="Driver's License Number"
                                        type="text"
                                        name="driver_license_number"
                                        value={data.driver_license_number}
                                        placeholder="e.g., 12-34567890"
                                        onChange={(e) => setData('driver_license_number', e.target.value)}
                                        error={errors.driver_license_number}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vehicle Type
                                    </label>
                                    <select
                                        name="vehicle_type"
                                        value={data.vehicle_type}
                                        onChange={(e) => setData('vehicle_type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Select vehicle type</option>
                                        <option value="Motorbike">Motorbike</option>
                                        <option value="Bicycle">Bicycle</option>
                                        <option value="Car">Car</option>
                                        <option value="Van">Van</option>
                                        <option value="Truck">Truck</option>
                                    </select>
                                    <InputError message={errors.vehicle_type} />
                                </div>

                                <div>
                                    <PrimaryInput
                                        label="License Plate"
                                        type="text"
                                        name="license_plate"
                                        value={data.license_plate}
                                        placeholder="e.g., 59A-12345"
                                        onChange={(e) => setData('license_plate', e.target.value)}
                                        error={errors.license_plate}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Document Upload Section */}
                        <div className="pb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Please upload clear photos of your documents. All documents are required for verification.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* ID Card Front */}
                                <div>
                                    <label htmlFor="id_card_front" className="block text-sm font-medium text-gray-700 mb-2">
                                        ID Card (Front)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                                        <input
                                            id="id_card_front"
                                            type="file"
                                            name="id_card_front"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={(e) => handleFileChange('id_card_front', e.target.files?.[0] || null)}
                                            className="hidden"
                                            required
                                        />
                                        <label htmlFor="id_card_front" className="cursor-pointer">
                                            {previews.id_card_front ? (
                                                <div>
                                                    <img 
                                                        src={previews.id_card_front} 
                                                        alt="ID Card Front Preview" 
                                                        className="w-full h-32 object-cover rounded-md mb-2"
                                                    />
                                                    <p className="text-sm text-indigo-600">Click to change</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v-8a4 4 0 00-4-4h-6m0 0l-6 6m6-6v6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-600">Upload ID Card Front</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    <InputError message={errors.id_card_front} />
                                </div>

                                {/* ID Card Back */}
                                <div>
                                    <label htmlFor="id_card_back" className="block text-sm font-medium text-gray-700 mb-2">
                                        ID Card (Back)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                                        <input
                                            id="id_card_back"
                                            type="file"
                                            name="id_card_back"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={(e) => handleFileChange('id_card_back', e.target.files?.[0] || null)}
                                            className="hidden"
                                            required
                                        />
                                        <label htmlFor="id_card_back" className="cursor-pointer">
                                            {previews.id_card_back ? (
                                                <div>
                                                    <img 
                                                        src={previews.id_card_back} 
                                                        alt="ID Card Back Preview" 
                                                        className="w-full h-32 object-cover rounded-md mb-2"
                                                    />
                                                    <p className="text-sm text-indigo-600">Click to change</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v-8a4 4 0 00-4-4h-6m0 0l-6 6m6-6v6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-600">Upload ID Card Back</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    <InputError message={errors.id_card_back} />
                                </div>

                                {/* Driver's License */}
                                <div>
                                    <label htmlFor="driver_license_front" className="block text-sm font-medium text-gray-700 mb-2">
                                        Driver's License
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                                        <input
                                            id="driver_license_front"
                                            type="file"
                                            name="driver_license_front"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={(e) => handleFileChange('driver_license_front', e.target.files?.[0] || null)}
                                            className="hidden"
                                            required
                                        />
                                        <label htmlFor="driver_license_front" className="cursor-pointer">
                                            {previews.driver_license_front ? (
                                                <div>
                                                    <img 
                                                        src={previews.driver_license_front} 
                                                        alt="Driver's License Preview" 
                                                        className="w-full h-32 object-cover rounded-md mb-2"
                                                    />
                                                    <p className="text-sm text-indigo-600">Click to change</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v-8a4 4 0 00-4-4h-6m0 0l-6 6m6-6v6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-600">Upload Driver's License</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    <InputError message={errors.driver_license_front} />
                                </div>
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/login"
                                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                                >
                                    Already have an account? Login here
                                </Link>

                                <div className="flex gap-4">
                                    <ActionButton
                                        type="submit"
                                        variant="primary"
                                        disabled={processing}
                                    >
                                        {processing ? 'Submitting...' : 'Submit Application'}
                                    </ActionButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}