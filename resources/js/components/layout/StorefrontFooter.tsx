import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

import { PaymentMarks } from '@/components/commerce/PaymentMarks';
import { NewsletterSignup } from '@/components/storefront/NewsletterSignup';
import { useToast } from '@/components/ui/toast';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import { BrandMark } from './BrandMark';

type StorefrontFooterProps = {
    compact?: boolean;
    onNewsletterSubmit?: (email: string) => void;
    className?: string;
};

const serviceLinks = [
    { labelKey: 'About ShopNest', href: '/about' },
    { labelKey: 'Contact', href: '/contact' },
    { labelKey: 'Terms of Service', href: '/terms' },
    { labelKey: 'Privacy Policy', href: '/privacy-policy' },
    { labelKey: 'Seller policy', href: '/selling-policy' },
];

const partnerLinks = [
    { labelKey: 'Sell with ShopNest', href: '/register/seller' },
    { labelKey: 'Deliver with ShopNest', href: '/register/shipper' },
    { labelKey: 'Vietnamese shops', href: '/#shop-viet' },
];

const supportLinks = [
    { labelKey: 'Search products', href: '/search' },
    { labelKey: 'Cart', href: '/cart' },
    { labelKey: 'My orders', href: '/user/orders' },
    { labelKey: 'Help center', href: '/contact' },
];

export function StorefrontFooter({ compact = false, onNewsletterSubmit, className }: StorefrontFooterProps) {
    const { success } = useToast();
    const { t } = useTranslation();

    const handleNewsletter = (email: string) => {
        if (onNewsletterSubmit) {
            onNewsletterSubmit(email);
            return;
        }

        success(t('Subscribed to the newsletter'), t('We will send weekly market stories to :email.', { email }));
    };

    return (
        <footer className="sn-storefront__footer">
            <div className={cx('sn-container sn-footer', className)} data-compact={compact ? 'true' : undefined}>
                <div className="sn-footer__grid">
                    <div className="sn-footer__brand">
                        <Link href="/" className="sn-brand">
                            <BrandMark />
                            <span className="sn-brand__name">ShopNest</span>
                        </Link>
                        <Text size="body-sm" tone="muted">
                            {t(
                                'A curated marketplace for Vietnamese homes and everyday life: electronics, home appliances, furniture, mother & baby, fashion and beauty.',
                            )}
                        </Text>
                        <div className="sn-footer__contact">
                            <span className="sn-footer__contact-line">
                                <MapPin aria-hidden="true" className="sn-footer__contact-icon" />
                                Tầng 5 Tòa nhà Emporium, 184 Lê Đại Hành, Phường 15, Quận 11, TP. Hồ Chí Minh
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

                    <FooterColumn
                        title={t('Services & standards')}
                        links={serviceLinks.map((link) => ({ label: t(link.labelKey), href: link.href }))}
                    />
                    <FooterColumn title={t('For partners')} links={partnerLinks.map((link) => ({ label: t(link.labelKey), href: link.href }))} />
                    <FooterColumn title={t('Support')} links={supportLinks.map((link) => ({ label: t(link.labelKey), href: link.href }))} />
                </div>

                {!compact && (
                    <div className="sn-footer__newsletter">
                        <div className="sn-footer__newsletter-copy">
                            <Eyebrow tone="accent">{t('Weekly market stories')}</Eyebrow>
                            <Heading level={3} size="headline-3">
                                {t('Get the weekly market letter')}
                            </Heading>
                            <Text size="body-sm" tone="muted">
                                {t('Handpicked products, seller stories and offers for Vietnamese homes.')}
                            </Text>
                        </div>
                        <div>
                            <NewsletterSignup onSubmit={handleNewsletter} />
                        </div>
                    </div>
                )}

                <div className="sn-footer__bottom">
                    <p className="sn-footer__copyright">
                        © {new Date().getFullYear()} ShopNest. {t('All rights reserved.')}
                    </p>
                    <div className="sn-footer__legal">
                        <PaymentMarks />
                        <Link href="/terms" className="sn-footer__link">
                            {t('Terms')}
                        </Link>
                        <Link href="/privacy-policy" className="sn-footer__link">
                            {t('Privacy')}
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
