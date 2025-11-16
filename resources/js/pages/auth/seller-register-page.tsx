import React, { useState } from 'react';
import HomeLayout from '@/layouts/app/HomeLayout';
import { Head } from '@inertiajs/react';

export default function SellerRegisterPage() {
    const [storeName, setStoreName] = useState('');
    const [email, setEmail] = useState('invalid-email');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [businessType, setBusinessType] = useState('Cá nhân');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    return (
        <HomeLayout>
            <Head title='Đăng ký người bán hàng' />
            <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
                <style>{`
                    .font-sans { font-family: 'Segoe UI', sans-serif; }
                `}</style>
                <main className="flex flex-1 justify-center px-4 py-8 sm:py-12 md:py-16">
                    <div className="w-full max-w-4xl">
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold leading-tight tracking-[-0.033em] text-text-light dark:text-text-dark">
                                Trở thành Người bán trên ShopNest
                            </h1>
                            <p className="mt-2 text-lg text-subtext-light dark:text-subtext-dark">
                                Tiếp cận hàng triệu khách hàng ngay hôm nay.
                            </p>
                        </div>
                        <div className="space-y-8 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 sm:p-8 md:p-10">
                            <section>
                                <h3 className="text-xl font-bold border-b border-border-light dark:border-border-dark pb-3 mb-6 text-text-light dark:text-text-dark">
                                    1. Thông tin cơ bản
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                    <label className="flex flex-col flex-1 col-span-2">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Tên cửa hàng/doanh nghiệp
                                        </p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-danger dark:border-danger bg-input-light dark:bg-input-dark h-12 px-4 text-base placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-danger focus:ring-2 focus:ring-danger/20"
                                            placeholder="Nhập tên cửa hàng của bạn"
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                        />
                                        <p className="mt-1.5 text-sm text-danger">Tên cửa hàng không được để trống.</p>
                                    </label>
                                    <label className="flex flex-col flex-1">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Địa chỉ email liên hệ
                                        </p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-danger dark:border-danger bg-input-light dark:bg-input-dark h-12 px-4 text-base placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-danger focus:ring-2 focus:ring-danger/20"
                                            placeholder="nguyenvana@email.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <p className="mt-1.5 text-sm text-danger">Địa chỉ email không hợp lệ.</p>
                                    </label>
                                    <label className="flex flex-col flex-1">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Số điện thoại
                                        </p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark h-12 px-4 text-base placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nhập số điện thoại"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col flex-1 col-span-2">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Địa chỉ kinh doanh
                                        </p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark h-12 px-4 text-base placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nhập địa chỉ đầy đủ"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col flex-1 col-span-2 md:col-span-1">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Loại hình kinh doanh
                                        </p>
                                        <select
                                            className="form-select flex w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark h-12 px-4 text-base text-text-light dark:text-text-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            value={businessType}
                                            onChange={(e) => setBusinessType(e.target.value)}
                                        >
                                            <option>Cá nhân</option>
                                            <option>Hộ kinh doanh</option>
                                            <option>Công ty</option>
                                        </select>
                                    </label>
                                </div>
                            </section>
                            <section>
                                <h3 className="text-xl font-bold border-b border-border-light dark:border-border-dark pb-3 mb-6 text-text-light dark:text-text-dark">
                                    2. Thông tin thanh toán
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                    <label className="flex flex-col flex-1">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Tên chủ tài khoản
                                        </p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark h-12 px-4 text-base placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="NGUYEN VAN A"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col flex-1">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Số tài khoản ngân hàng
                                        </p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark h-12 px-4 text-base placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nhập số tài khoản"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col flex-1 col-span-2">
                                        <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                            Tên ngân hàng
                                        </p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark h-12 px-4 text-base placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Ví dụ: Vietcombank, ACB,..."
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <p className="mt-3 text-sm text-subtext-light dark:text-subtext-dark">
                                    Thông tin này được dùng để nhận thanh toán từ ShopNest.
                                </p>
                            </section>
                            <section>
                                <h3 className="text-xl font-bold border-b border-border-light dark:border-border-dark pb-3 mb-6 text-text-light dark:text-text-dark">
                                    3. Tài liệu
                                </h3>
                                <div className="flex flex-col w-full">
                                    <p className="text-base font-medium pb-2 text-text-light dark:text-text-dark">
                                        Giấy phép kinh doanh (nếu có)
                                    </p>
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-danger dark:border-danger border-dashed rounded-lg cursor-pointer bg-red-50 dark:bg-danger/10 hover:bg-red-100 dark:hover:bg-danger/20"
                                            htmlFor="dropzone-file"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <span className="material-symbols-outlined text-4xl text-danger">cloud_upload</span>
                                                <p className="mb-2 text-sm text-danger">
                                                    <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo và thả
                                                </p>
                                                <p className="text-xs text-subtext-light dark:text-subtext-dark">
                                                    PDF, PNG, JPG (Tối đa 5MB)
                                                </p>
                                            </div>
                                            <input className="hidden" id="dropzone-file" type="file" />
                                        </label>
                                    </div>
                                    <p className="mt-1.5 text-sm text-danger">
                                        Vui lòng tải lên giấy phép kinh doanh hợp lệ.
                                    </p>
                                </div>
                            </section>
                            <section>
                                <div className="flex items-start">
                                    <div className="flex flex-col">
                                        <div className="flex items-start space-x-3">
                                            <input
                                                className="form-checkbox h-5 w-5 rounded border-danger dark:border-danger text-primary focus:ring-primary/50 bg-input-light dark:bg-input-dark mt-0.5"
                                                id="terms"
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                            />
                                            <label className="text-sm text-subtext-light dark:text-subtext-dark" htmlFor="terms">
                                                Tôi đã đọc và đồng ý với{' '}
                                                <a className="font-medium text-primary hover:underline" href="#">
                                                    Điều khoản Dịch vụ
                                                </a>{' '}
                                                và{' '}
                                                <a className="font-medium text-primary hover:underline" href="#">
                                                    Chính sách Người bán
                                                </a>{' '}
                                                của ShopNest.
                                            </label>
                                        </div>
                                        <p className="mt-1.5 text-sm text-danger pl-8">
                                            Bạn phải đồng ý với điều khoản để tiếp tục.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-10 flex flex-col sm:flex-row-reverse items-center gap-4">
                                    <button
                                        className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8 text-base font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-opacity-50"
                                        style={{ backgroundColor: '#1976D2' }}
                                        disabled
                                        type="submit"
                                    >
                                        Đăng ký trở thành người bán
                                    </button>
                                    <button
                                        className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-background-light dark:bg-border-dark h-12 px-8 text-base font-bold text-text-light dark:text-text-dark hover:bg-border-light dark:hover:bg-border-dark/80 focus:outline-none"
                                        type="button"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </HomeLayout>
    );
}
