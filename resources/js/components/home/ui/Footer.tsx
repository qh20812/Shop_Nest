import React from 'react'


export default function Footer() {
    return (
        <footer className='home-footer-container'>
            <div className="home-footer-content">
                <div className="home-footer-columns">
                    {/* Left Column - Logo & Contact Info */}
                    <div className="footer-column footer-column-logo">
                        <div className="footer-logo">
                            <img src="/image/ShopnestLogoNoColor.png" alt="ShopNest Logo" />
                            <span className="footer-brand-name">ShopNest</span>
                        </div>
                        <div className="footer-contact-info">
                            <div className="contact-item">
                                <i className="bi bi-geo-alt"></i>
                                <span>123 Đường ABC, Quận 1, TP. HCM</span>
                            </div>
                            <div className="contact-item">
                                <i className="bi bi-envelope"></i>
                                <span>contact@shopnest.com</span>
                            </div>
                            <div className="contact-item">
                                <i className="bi bi-telephone"></i>
                                <span>0123 456 789</span>
                            </div>
                        </div>
                    </div>

                    {/* First Middle Column - About ShopNest */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">Về ShopNest</h3>
                        <ul className="footer-links">
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Tuyển dụng</a></li>
                            <li><a href="#">Liên hệ</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>

                    {/* Second Middle Column - Support Policies */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">Chính sách & Hỗ trợ</h3>
                        <ul className="footer-links">
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Chính sách vận chuyển</a></li>
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Điều khoản sử dụng</a></li>
                            <li><a href="#">Hỗ trợ khách hàng</a></li>
                        </ul>
                    </div>

                    {/* Right Column - Customer & Seller Links */}
                    <div className="footer-column footer-column-split">
                        {/* Customer Section */}
                        <div className="footer-section">
                            <h3 className="footer-section-title">Dành cho khách hàng</h3>
                            <ul className="footer-links">
                                <li><a href="#">Hướng dẫn mua hàng</a></li>
                                <li><a href="#">Thanh toán & vận chuyển</a></li>
                                <li><a href="#">Câu hỏi thường gặp</a></li>
                            </ul>
                        </div>
                        
                        {/* Seller Section */}
                        <div className="footer-section">
                            <h3 className="footer-section-title">Dành cho người bán</h3>
                            <ul className="footer-links">
                                <li><a href="#">Đăng ký bán hàng</a></li>
                                <li><a href="#">Hướng dẫn bán hàng</a></li>
                                <li><a href="#">Trung tâm người bán</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="home-footer-bottom">
                <div className="footer-bottom-content">
                    <span className="copyright">© {new Date().getFullYear()} ShopNest. All rights reserved.</span>
                    <div className="footer-social">
                        <span>Kết nối với chúng tôi:</span>
                        <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="social-link"><i className="bi bi-instagram"></i></a>
                        <a href="#" className="social-link"><i className="bi bi-youtube"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
