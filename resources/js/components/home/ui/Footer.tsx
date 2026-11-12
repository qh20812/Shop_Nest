import React from 'react';
import { Link } from '@inertiajs/react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-card border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img src="/ShopNest2.png" alt="ShopNest Logo" className="h-10 w-10" />
                            <h3 className="text-xl font-bold text-foreground">ShopNest</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Mang đến trải nghiệm mua sắm tuyệt vời với hàng triệu sản phẩm chất lượng.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                                aria-label="Youtube"
                            >
                                <Youtube className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold text-foreground">Liên kết nhanh</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Về chúng tôi
                            </Link>
                            <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Sản phẩm
                            </Link>
                            <Link href="/promotions" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Khuyến mãi
                            </Link>
                            <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Tin tức
                            </Link>
                            <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Liên hệ
                            </Link>
                        </nav>
                    </div>

                    {/* Customer Support */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold text-foreground">Hỗ trợ khách hàng</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Câu hỏi thường gặp
                            </Link>
                            <Link href="/shipping" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Chính sách giao hàng
                            </Link>
                            <Link href="/returns" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Chính sách đổi trả
                            </Link>
                            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Chính sách bảo mật
                            </Link>
                            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Điều khoản sử dụng
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold text-foreground">Liên hệ</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <a href="tel:+84123456789" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    +84 123 456 789
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <a href="mailto:support@shopnest.vn" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                    support@shopnest.vn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-border pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} ShopNest. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Điều khoản
                            </Link>
                            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Bảo mật
                            </Link>
                            <Link href="/cookies" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
