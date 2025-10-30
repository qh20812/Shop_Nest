// resources/js/Pages/About.tsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';
import '../../../css/About.css'; // Quan trọng: Đảm bảo bạn import file CSS này

// Giả sử bạn có thể nhập ảnh (nếu đang dùng webpack/vite)
// import teamImage from '/images/team-shopnest.jpg'; 

export default function About() {
    return (
        <div>
            <Head title="Về chúng tôi - ShopNest" />

            <div className="about-container">
                <div className="about-card">

                    {/* Phần Mở Đầu và Tóm Tắt */}
                    <header className="about-header">
                        <h1 className="about-title">
                            Khám Phá ShopNest: Nơi Chất Lượng Gặp Gỡ Đam Mê
                        </h1>
                        <p className="about-subtitle">
                            Chúng tôi không chỉ là một sàn thương mại điện tử. Chúng tôi là tổ ấm, nơi mọi nhu cầu mua sắm của bạn được đáp ứng với sự tận tâm và chuyên nghiệp.
                        </p>
                    </header>

                    <div className="about-content-body">

                        {/* 1. Câu Chuyện Của Chúng Tôi */}
                        <section className="about-section">
                            <h2 className="section-heading primary-border">Câu Chuyện Khởi Nghiệp</h2>
                            <p className="section-paragraph">
                                ShopNest ra đời vào năm 2025 từ niềm trăn trở của nhóm sáng lập về một nền tảng mua sắm trực tuyến **minh bạch và đáng tin cậy**. Trong bối cảnh thị trường bùng nổ hàng hóa, khách hàng thường xuyên phải đối mặt với nỗi lo về chất lượng và nguồn gốc sản phẩm.
                            </p>
                            <p className="section-paragraph">
                                **Mục tiêu của chúng tôi** là tạo ra một "tổ ấm" (Nest) an toàn, nơi mọi sản phẩm đều được kiểm định nghiêm ngặt, từ đó giúp khách hàng yên tâm tận hưởng trải nghiệm mua sắm tiện lợi mà không phải đánh đổi niềm tin.
                            </p>
                        </section>

                        {/* 2. Sứ Mệnh, Tầm Nhìn & Mục tiêu */}
                        <section className="mission-vision-grid">
                            <div className="mission-card">
                                <h3 className="card-title">Sứ Mệnh</h3>
                                <p className="card-paragraph">Mang đến trải nghiệm mua sắm tuyệt vời nhất thông qua sản phẩm chất lượng và dịch vụ vượt trội, tạo cầu nối tin cậy giữa người bán và người mua.</p>
                            </div>
                            <div className="mission-card">
                                <h3 className="card-title">Tầm Nhìn</h3>
                                <p className="card-paragraph">Trở thành nền tảng thương mại điện tử được yêu thích nhất tại Việt Nam, dẫn đầu về sự minh bạch và đổi mới công nghệ.</p>
                            </div>
                            <div className="mission-card">
                                <h3 className="card-title">Mục Tiêu</h3>
                                <p className="card-paragraph">Mở rộng danh mục sản phẩm lên 100.000 mặt hàng và đạt 5 triệu khách hàng thân thiết vào năm 2027.</p>
                            </div>
                        </section>

                        {/* 3. Giá Trị Cốt Lõi */}
                        <section className="about-section">
                            <h2 className="section-heading primary-border">Giá Trị Cốt Lõi</h2>
                            <ul className="core-values-grid">
                                <li className="core-value-item">
                                    {/* Sử dụng SVG với class CSS */}
                                    <svg className="value-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.276A11.955 111.955 0 0112 2c-2.43 0-4.706.776-6.618 2.224M12 22c-2.43 0-4.706-.776-6.618-2.224m13.236-15.552A11.955 11.955 0 0112 22c-2.43 0-4.706-.776-6.618-2.224"></path></svg>
                                    <div>
                                        <h4 className="value-title">Minh Bạch & Đáng Tin Cậy</h4>
                                        <p className="value-description">Mọi sản phẩm đều có nguồn gốc rõ ràng, cam kết thông tin trung thực về giá cả và chất lượng.</p>
                                    </div>
                                </li>
                                <li className="core-value-item">
                                    <svg className="value-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    <div>
                                        <h4 className="value-title">Đổi Mới Liên Tục</h4>
                                        <p className="value-description">Áp dụng công nghệ tiên tiến để tối ưu hóa trải nghiệm người dùng, từ tìm kiếm đến thanh toán và giao nhận.</p>
                                    </div>
                                </li>
                                <li className="core-value-item">
                                    <svg className="value-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    <div>
                                        <h4 className="value-title">Khách Hàng Là Trọng Tâm</h4>
                                        <p className="value-description">Lắng nghe mọi phản hồi, cung cấp hỗ trợ 24/7 và chính sách hậu mãi linh hoạt, đặt lợi ích khách hàng lên hàng đầu.</p>
                                    </div>
                                </li>
                                <li className="core-value-item">
                                    <svg className="value-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                                    <div>
                                        <h4 className="value-title">Trách Nhiệm Xã Hội</h4>
                                        <p className="value-description">Khuyến khích tiêu dùng bền vững, hỗ trợ các doanh nghiệp nhỏ và vừa phát triển trên nền tảng của chúng tôi.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        {/* 4. Giới Thiệu Đội Ngũ */}
                        <section className="about-section team-section">
                            <h2 className="section-heading primary-border team-heading">Những Người Tạo Nên ShopNest</h2>

                            <div className="team-member-list">
                                <p className="team-member-name">Huỳnh Ngọc Quí: Full-stack Web Development</p>
                                <p className="team-member-name">Vương Khánh Nhân: Full-stack Web Development</p>
                                <p className="team-member-name">Trần Diệu Vỹ: Full-stack Web Development</p>
                            </div>

                            <div className="contact-button-wrapper">
                                <Link href="/contact" className="contact-button">
                                    Gặp gỡ đội ngũ của chúng tôi
                                </Link>
                            </div>
                        </section>

                        {/* 5. Kêu Gọi Hành Động (CTA) */}
                        <section className="cta-section">
                            <h3 className="cta-title">Bạn đã sẵn sàng mua sắm?</h3>
                            <p className="cta-subtitle">
                                Bắt đầu hành trình khám phá những sản phẩm chất lượng được chọn lọc kỹ càng từ ShopNest ngay hôm nay!
                            </p>
                            <Link
                                href="/"
                                className="cta-button"
                            >
                                Khám phá trang web của chúng tôi
                            </Link>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}