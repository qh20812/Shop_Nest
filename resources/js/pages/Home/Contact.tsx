import React from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';

export default function Contact() {
    return (
        <HomeLayout>
            <Head title="Liên hệ - ShopNest" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-8">Liên hệ với chúng tôi</h1>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gửi tin nhắn</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập email của bạn"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chủ đề
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Chủ đề tin nhắn"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nội dung
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập nội dung tin nhắn của bạn"
                                    ></textarea>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                        
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Địa chỉ</h3>
                                        <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP.HCM</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Điện thoại</h3>
                                        <p className="text-gray-600">0123 456 789</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Email</h3>
                                        <p className="text-gray-600">contact@shopnest.com</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Giờ làm việc</h3>
                                        <p className="text-gray-600">
                                            Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                                            Thứ 7 - Chủ nhật: 9:00 - 17:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
