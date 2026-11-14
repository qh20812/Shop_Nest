import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

import { PaymentMarks } from '@/components/commerce/PaymentMarks';
import { NewsletterSignup } from '@/components/storefront/NewsletterSignup';
import { useToast } from '@/components/ui/toast';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { PageContainer } from './PageContainer';

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
        <footer className={cn('mt-section border-t border-border bg-rice-paper', className)}>
            <PageContainer className={cn('py-12 lg:py-16', compact && 'py-10')}>
                <div className={cn('grid gap-10', compact ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4')}>
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="focus-ring flex w-fit items-center gap-2.5 rounded-chip">
                            <img src="/image/ShopnestLogo.png" alt="ShopNest" className="size-10 object-contain" />
                            <span className="text-headline-3 font-semibold text-ink">ShopNest</span>
                        </Link>
                        <Text size="body-sm" tone="muted" className="max-w-sm">
                            Sàn thương mại điện tử tuyển chọn cho tổ ấm và đời sống người Việt: điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm
                            đẹp.
                        </Text>
                        <div className="flex flex-col gap-2 text-body-sm text-ink-muted">
                            <span className="inline-flex items-center gap-2">
                                <MapPin aria-hidden="true" className="size-4 text-ink-faint" />
                                Số 18, Ngõ 42, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội
                            </span>
                            <a href="tel:19006886" className="inline-flex items-center gap-2 transition-colors hover:text-lacquer-red">
                                <Phone aria-hidden="true" className="size-4 text-ink-faint" />
                                1900 6886
                            </a>
                            <a href="mailto:hotro@shopnest.vn" className="inline-flex items-center gap-2 transition-colors hover:text-lacquer-red">
                                <Mail aria-hidden="true" className="size-4 text-ink-faint" />
                                hotro@shopnest.vn
                            </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {['Facebook', 'Instagram', 'YouTube'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="focus-ring rounded-pill border border-border px-3 py-1.5 text-body-sm text-ink-muted transition-colors hover:bg-lacquer-wash hover:text-lacquer-red"
                                >
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
                    <div className="mt-10 grid gap-6 border-t border-border pt-8 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-7">
                            <Eyebrow tone="accent">Chuyện chợ mỗi tuần</Eyebrow>
                            <Heading level={3} size="headline-3" className="mt-1">
                                Nhận chuyện chợ mỗi tuần
                            </Heading>
                            <Text size="body-sm" tone="muted" className="mt-1 max-w-lg">
                                Tuyển chọn sản phẩm, câu chuyện nhà bán và ưu đãi dành cho tổ ấm Việt.
                            </Text>
                        </div>
                        <div className="lg:col-span-5">
                            <NewsletterSignup onSubmit={handleNewsletter} />
                        </div>
                    </div>
                )}

                <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
                    <p className="text-body-sm text-ink-faint">© {new Date().getFullYear()} ShopNest. Tất cả quyền được bảo lưu.</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <PaymentMarks />
                        <Link href="/terms" className="text-body-sm text-ink-muted transition-colors hover:text-lacquer-red">
                            Điều khoản
                        </Link>
                        <Link href="/privacy-policy" className="text-body-sm text-ink-muted transition-colors hover:text-lacquer-red">
                            Bảo mật
                        </Link>
                    </div>
                </div>
            </PageContainer>
        </footer>
    );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-headline-3 text-ink">{title}</h3>
            <nav className="flex flex-col gap-2.5" aria-label={title}>
                {links.map((link) => (
                    <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        className="focus-ring w-fit text-body-sm text-ink-muted transition-colors hover:text-lacquer-red"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default StorefrontFooter;
