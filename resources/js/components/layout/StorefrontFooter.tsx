import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

import { PaymentMarks } from '@/components/commerce/PaymentMarks';
import { NewsletterSignup } from '@/components/storefront/NewsletterSignup';
import { useToast } from '@/components/ui/toast';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';

type StorefrontFooterProps = {
    compact?: boolean;
    onNewsletterSubmit?: (email: string) => void;
    className?: string;
};

const serviceLinks = [
    { label: 'Về ShopNest', href: '/about' },
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Điều khoản sử dụng', href: '/terms' },
    { label: 'Chính sách bảo mật', href: '/privacy-policy' },
    { label: 'Chính sách người bán', href: '/selling-policy' },
];

const partnerLinks = [
    { label: 'Bán hàng cùng ShopNest', href: '/register/seller' },
    { label: 'Giao vận cùng ShopNest', href: '/register/shipper' },
    { label: 'Shop Việt', href: '/#shop-viet' },
];

const supportLinks = [
    { label: 'Tìm sản phẩm', href: '/search' },
    { label: 'Giỏ hàng', href: '/cart' },
    { label: 'Đơn hàng của tôi', href: '/user/orders' },
    { label: 'Trung tâm hỗ trợ', href: '/contact' },
];

export function StorefrontFooter({ compact = false, onNewsletterSubmit, className }: StorefrontFooterProps) {
    const { success } = useToast();

    const handleNewsletter = (email: string) => {
        if (onNewsletterSubmit) {
            onNewsletterSubmit(email);
            return;
        }

        success('Đã đăng ký bản tin', `Chúng tôi sẽ gửi chuyện chợ mỗi tuần đến ${email}.`);
    };

    return (
        <footer className="sn-storefront__footer">
            <div className={cx('sn-container sn-footer', className)} data-compact={compact ? 'true' : undefined}>
                <div className="sn-footer__grid">
                    <div className="sn-footer__brand">
                        <Link href="/" className="sn-brand">
                            <img src="/image/ShopnestLogo.png" alt="ShopNest" className="sn-brand__logo" />
                            <span className="sn-brand__name">ShopNest</span>
                        </Link>
                        <Text size="body-sm" tone="muted">
                            Sàn thương mại điện tử tuyển chọn cho tổ ấm và đời sống người Việt: điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm
                            đẹp.
                        </Text>
                        <div className="sn-footer__contact">
                            <span className="sn-footer__contact-line">
                                <MapPin aria-hidden="true" className="sn-footer__contact-icon" />
                                Số 18, Ngõ 42, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội
                            </span>
                            <a href="tel:19006886" className="sn-footer__contact-line">
                                <Phone aria-hidden="true" className="sn-footer__contact-icon" />
                                1900 6886
                            </a>
                            <a href="mailto:hotro@shopnest.vn" className="sn-footer__contact-line">
                                <Mail aria-hidden="true" className="sn-footer__contact-icon" />
                                hotro@shopnest.vn
                            </a>
                        </div>
                        <div className="sn-footer__social">
                            {['Facebook', 'Instagram', 'YouTube'].map((social) => (
                                <a key={social} href="#" className="sn-footer__social-link">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    <FooterColumn title="Dịch vụ & tiêu chuẩn" links={serviceLinks} />
                    <FooterColumn title="Dành cho đối tác" links={partnerLinks} />
                    <FooterColumn title="Hỗ trợ" links={supportLinks} />
                </div>

                {!compact && (
                    <div className="sn-footer__newsletter">
                        <div className="sn-footer__newsletter-copy">
                            <Eyebrow tone="accent">Chuyện chợ mỗi tuần</Eyebrow>
                            <Heading level={3} size="headline-3">
                                Nhận chuyện chợ mỗi tuần
                            </Heading>
                            <Text size="body-sm" tone="muted">
                                Tuyển chọn sản phẩm, câu chuyện nhà bán và ưu đãi dành cho tổ ấm Việt.
                            </Text>
                        </div>
                        <div>
                            <NewsletterSignup onSubmit={handleNewsletter} />
                        </div>
                    </div>
                )}

                <div className="sn-footer__bottom">
                    <p className="sn-footer__copyright">© {new Date().getFullYear()} ShopNest. Tất cả quyền được bảo lưu.</p>
                    <div className="sn-footer__legal">
                        <PaymentMarks />
                        <Link href="/terms" className="sn-footer__link">
                            Điều khoản
                        </Link>
                        <Link href="/privacy-policy" className="sn-footer__link">
                            Bảo mật
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
    return (
        <div className="sn-footer__col">
            <h3 className="sn-footer__col-title">{title}</h3>
            <nav className="sn-footer__links" aria-label={title}>
                {links.map((link) => (
                    <Link key={`${link.href}-${link.label}`} href={link.href} className="sn-footer__link">
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default StorefrontFooter;
