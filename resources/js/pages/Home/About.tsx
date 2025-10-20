import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';
// Giả sử bạn có thể nhập ảnh (nếu đang dùng webpack/vite)
// import teamImage from '/images/team-shopnest.jpg'; 

export default function About() {
    return (
        <HomeLayout>
            <Head title="Về chúng tôi - ShopNest" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-12">
                    {/* Phần Mở Đầu và Tóm Tắt */}
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
                            Khám Phá ShopNest: Nơi Chất Lượng Gặp Gỡ Đam Mê
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chúng tôi không chỉ là một sàn thương mại điện tử. Chúng tôi là tổ ấm, nơi mọi nhu cầu mua sắm của bạn được đáp ứng với sự tận tâm và chuyên nghiệp.
                        </p>
                    </header>

                    <div className="prose max-w-none space-y-12">

                        {/* 1. Câu Chuyện Của Chúng Tôi (Lịch sử & Vấn đề) */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-4">Câu Chuyện Khởi Nghiệp</h2>
                            <p className="text-lg text-gray-700 mb-4">
                                ShopNest ra đời vào năm 2020 từ niềm trăn trở của nhóm sáng lập về một nền tảng mua sắm trực tuyến **minh bạch và đáng tin cậy**. Trong bối cảnh thị trường bùng nổ hàng hóa, khách hàng thường xuyên phải đối mặt với nỗi lo về chất lượng và nguồn gốc sản phẩm.
                            </p>
                            <p className="text-lg text-gray-700">
                                **Mục tiêu của chúng tôi** là tạo ra một "tổ ấm" (Nest) an toàn, nơi mọi sản phẩm đều được kiểm định nghiêm ngặt, từ đó giúp khách hàng yên tâm tận hưởng trải nghiệm mua sắm tiện lợi mà không phải đánh đổi niềm tin.
                            </p>
                        </section>

                        {/* 2. Sứ Mệnh, Tầm Nhìn & Mục tiêu */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-6 border rounded-lg shadow-md bg-blue-50">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">Sứ Mệnh</h3>
                                <p className="text-gray-700">Mang đến trải nghiệm mua sắm tuyệt vời nhất thông qua sản phẩm chất lượng và dịch vụ vượt trội, tạo cầu nối tin cậy giữa người bán và người mua.</p>
                            </div>
                            <div className="p-6 border rounded-lg shadow-md bg-blue-50">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">Tầm Nhìn</h3>
                                <p className="text-gray-700">Trở thành nền tảng thương mại điện tử được yêu thích nhất tại Việt Nam, dẫn đầu về sự minh bạch và đổi mới công nghệ.</p>
                            </div>
                            <div className="p-6 border rounded-lg shadow-md bg-blue-50">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">Mục Tiêu</h3>
                                <p className="text-gray-700">Mở rộng danh mục sản phẩm lên 100.000 mặt hàng và đạt 5 triệu khách hàng thân thiết vào năm 2027.</p>
                            </div>
                        </section>

                        {/* 3. Giá Trị Cốt Lõi (Why ShopNest) */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4">Giá Trị Cốt Lõi</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <li className="flex items-start space-x-3">
                                    <svg className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="#"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.276A11.955 111.955 0 0112 2c-2.43 0-4.706.776-6.618 2.224M12 22c-2.43 0-4.706-.776-6.618-2.224m13.236-15.552A11.955 11.955 0 0112 22c-2.43 0-4.706-.776-6.618-2.224"></path></svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Minh Bạch & Đáng Tin Cậy</h4>
                                        <p className="text-gray-600">Mọi sản phẩm đều có nguồn gốc rõ ràng, cam kết thông tin trung thực về giá cả và chất lượng.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="#"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Đổi Mới Liên Tục</h4>
                                        <p className="text-gray-600">Áp dụng công nghệ tiên tiến để tối ưu hóa trải nghiệm người dùng, từ tìm kiếm đến thanh toán và giao nhận.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="#"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Khách Hàng Là Trọng Tâm</h4>
                                        <p className="text-gray-600">Lắng nghe mọi phản hồi, cung cấp hỗ trợ 24/7 và chính sách hậu mãi linh hoạt, đặt lợi ích khách hàng lên hàng đầu.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="#"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Trách Nhiệm Xã Hội</h4>
                                        <p className="text-gray-600">Khuyến khích tiêu dùng bền vững, hỗ trợ các doanh nghiệp nhỏ và vừa phát triển trên nền tảng của chúng tôi.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        {/* 4. Giới Thiệu Đội Ngũ (Ví dụ cơ bản) */}
                        <section className="text-left">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4 inline-block">Những Người Tạo Nên ShopNest</h2>
                            <p className="text-lg text-gray-700 mb-8">
                                Huỳnh Ngọc Quí: Full-stack Web Development
                            </p>
                            <p className="text-lg text-gray-700 mb-8">
                                Vương Khánh Nhân: Full-stack Web Development
                            </p>
                            <p className="text-lg text-gray-700 mb-8">
                                Trần Diệu Vỹ: Full-stack Web Development
                            </p>
                            {/* Bạn có thể thêm các thẻ card giới thiệu thành viên tại đây */}
                            {/* <img src={teamImage} alt="Đội ngũ ShopNest" className="mx-auto w-full max-w-2xl rounded-lg shadow-lg" /> */}

                            <div className="text-center">
                                <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300">
                                    Gặp gỡ đội ngũ của chúng tôi
                                </Link>
                            </div>
                        </section>

                        {/* 5. Kêu Gọi Hành Động (CTA) */}
                        <section className="bg-blue-800 text-white p-8 rounded-lg text-center shadow-lg">
                            <h3 className="text-3xl font-bold mb-3">Bạn đã sẵn sàng mua sắm?</h3>
                            <p className="text-lg mb-6">
                                Bắt đầu hành trình khám phá những sản phẩm chất lượng được chọn lọc kỹ càng từ ShopNest ngay hôm nay!
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-blue-800 bg-white hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                            >
                                Khám phá trang web của chúng tôi
                            </Link>
                        </section>

                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}