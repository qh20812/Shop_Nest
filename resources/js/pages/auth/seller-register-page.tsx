import HomeLayout from '@/layouts/app/HomeLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

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
            <Head title="Đăng ký người bán hàng" />
            <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark relative flex min-h-screen w-full flex-col font-sans">
                <style>{`
                    .font-sans { font-family: 'Segoe UI', sans-serif; }
                `}</style>
                <main className="flex flex-1 justify-center px-4 py-8 sm:py-12 md:py-16">
                    <div className="w-full max-w-4xl">
                        <div className="mb-8 text-center">
                            <h1 className="text-text-light dark:text-text-dark text-4xl leading-tight font-bold tracking-[-0.033em]">
                                Trở thành Người bán trên ShopNest
                            </h1>
                            <p className="text-subtext-light dark:text-subtext-dark mt-2 text-lg">Tiếp cận hàng triệu khách hàng ngay hôm nay.</p>
                        </div>
                        <div className="border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark space-y-8 rounded-xl border p-6 sm:p-8 md:p-10">
                            <section>
                                <h3 className="border-border-light dark:border-border-dark text-text-light dark:text-text-dark mb-6 border-b pb-3 text-xl font-bold">
                                    1. Thông tin cơ bản
                                </h3>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                                    <label className="col-span-2 flex flex-1 flex-col">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Tên cửa hàng/doanh nghiệp</p>
                                        <input
                                            className="form-input border-danger dark:border-danger bg-input-light dark:bg-input-dark placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-danger focus:ring-danger/20 flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border px-4 text-base focus:ring-2"
                                            placeholder="Nhập tên cửa hàng của bạn"
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                        />
                                        <p className="text-danger mt-1.5 text-sm">Tên cửa hàng không được để trống.</p>
                                    </label>
                                    <label className="flex flex-1 flex-col">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Địa chỉ email liên hệ</p>
                                        <input
                                            className="form-input border-danger dark:border-danger bg-input-light dark:bg-input-dark placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:border-danger focus:ring-danger/20 flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border px-4 text-base focus:ring-2"
                                            placeholder="nguyenvana@email.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <p className="text-danger mt-1.5 text-sm">Địa chỉ email không hợp lệ.</p>
                                    </label>
                                    <label className="flex flex-1 flex-col">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Số điện thoại</p>
                                        <input
                                            className="form-input border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nhập số điện thoại"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </label>
                                    <label className="col-span-2 flex flex-1 flex-col">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Địa chỉ kinh doanh</p>
                                        <input
                                            className="form-input border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nhập địa chỉ đầy đủ"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </label>
                                    <label className="col-span-2 flex flex-1 flex-col md:col-span-1">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Loại hình kinh doanh</p>
                                        <select
                                            className="form-select border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark flex h-12 w-full min-w-0 flex-1 overflow-hidden rounded-lg border px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                <h3 className="border-border-light dark:border-border-dark text-text-light dark:text-text-dark mb-6 border-b pb-3 text-xl font-bold">
                                    2. Thông tin thanh toán
                                </h3>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                                    <label className="flex flex-1 flex-col">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Tên chủ tài khoản</p>
                                        <input
                                            className="form-input border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="NGUYEN VAN A"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-1 flex-col">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Số tài khoản ngân hàng</p>
                                        <input
                                            className="form-input border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Nhập số tài khoản"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                        />
                                    </label>
                                    <label className="col-span-2 flex flex-1 flex-col">
                                        <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Tên ngân hàng</p>
                                        <input
                                            className="form-input border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Ví dụ: Vietcombank, ACB,..."
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <p className="text-subtext-light dark:text-subtext-dark mt-3 text-sm">
                                    Thông tin này được dùng để nhận thanh toán từ ShopNest.
                                </p>
                            </section>
                            <section>
                                <h3 className="border-border-light dark:border-border-dark text-text-light dark:text-text-dark mb-6 border-b pb-3 text-xl font-bold">
                                    3. Tài liệu
                                </h3>
                                <div className="flex w-full flex-col">
                                    <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">Giấy phép kinh doanh (nếu có)</p>
                                    <div className="flex w-full items-center justify-center">
                                        <label
                                            className="border-danger dark:border-danger dark:bg-danger/10 dark:hover:bg-danger/20 flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-red-50 hover:bg-red-100"
                                            htmlFor="dropzone-file"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <span className="material-symbols-outlined text-danger text-4xl">cloud_upload</span>
                                                <p className="text-danger mb-2 text-sm">
                                                    <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo và thả
                                                </p>
                                                <p className="text-subtext-light dark:text-subtext-dark text-xs">PDF, PNG, JPG (Tối đa 5MB)</p>
                                            </div>
                                            <input className="hidden" id="dropzone-file" type="file" />
                                        </label>
                                    </div>
                                    <p className="text-danger mt-1.5 text-sm">Vui lòng tải lên giấy phép kinh doanh hợp lệ.</p>
                                </div>
                            </section>
                            <section>
                                <div className="flex items-start">
                                    <div className="flex flex-col">
                                        <div className="flex items-start space-x-3">
                                            <input
                                                className="form-checkbox border-danger dark:border-danger bg-input-light dark:bg-input-dark mt-0.5 h-5 w-5 rounded text-primary focus:ring-primary/50"
                                                id="terms"
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                            />
                                            <label className="text-subtext-light dark:text-subtext-dark text-sm" htmlFor="terms">
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
                                        <p className="text-danger mt-1.5 pl-8 text-sm">Bạn phải đồng ý với điều khoản để tiếp tục.</p>
                                    </div>
                                </div>
                                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row-reverse">
                                    <button
                                        className="disabled:bg-opacity-50 flex h-12 w-full items-center justify-center rounded-lg px-8 text-base font-bold text-white shadow-sm disabled:cursor-not-allowed sm:w-auto"
                                        style={{ backgroundColor: '#1976D2' }}
                                        disabled
                                        type="submit"
                                    >
                                        Đăng ký trở thành người bán
                                    </button>
                                    <button
                                        className="bg-background-light dark:bg-border-dark text-text-light dark:text-text-dark hover:bg-border-light dark:hover:bg-border-dark/80 flex h-12 w-full items-center justify-center rounded-lg px-8 text-base font-bold focus:outline-none sm:w-auto"
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
