import { Link } from '@inertiajs/react';
import { CheckCircle2, Headset, Mail } from 'lucide-react';

import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';

import { BrandMark } from './BrandMark';

type AuthRole = 'customer' | 'seller' | 'shipper';

type AuthBrandPanelProps = {
    role?: AuthRole;
    eyebrow?: string;
    headline?: string;
    description?: string;
    className?: string;
};

const roleContent: Record<AuthRole, { eyebrow: string; headline: string; description: string }> = {
    customer: {
        eyebrow: 'Chợ nhỏ, tổ ấm',
        headline: 'Đồ thật, người thật, chuyện thật.',
        description: 'Mọi thứ cho tổ ấm Việt: điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm đẹp từ các shop đã kiểm duyệt.',
    },
    seller: {
        eyebrow: 'Dành cho người bán',
        headline: 'Mang gian hàng của bạn đến đúng người.',
        description: 'ShopNest tuyển chọn nhà bán tử tế, minh bạch nguồn gốc và đồng hành từ gian hàng đến đơn hàng đầu tiên.',
    },
    shipper: {
        eyebrow: 'Dành cho đối tác giao vận',
        headline: 'Mỗi kiện hàng, một chặng đường êm.',
        description: 'Tham gia mạng lưới giao vận ShopNest, nhận đơn rõ ràng và đồng hành cùng hàng nghìn tổ ấm Việt.',
    },
};

const trustPoints = ['Shop đã kiểm duyệt', 'Đổi trả theo chính sách', 'Hỗ trợ qua hotline'];

export function AuthBrandPanel({ role = 'customer', eyebrow, headline, description, className }: AuthBrandPanelProps) {
    const content = roleContent[role];

    return (
        <aside className={cx('sn-auth__panel-inner', className)}>
            <div className="sn-auth__panel-copy">
                <Link href="/" className="sn-brand">
                    <BrandMark />
                    <span className="sn-brand__name">ShopNest</span>
                </Link>

                <Eyebrow tone="accent">{eyebrow ?? content.eyebrow}</Eyebrow>
                <Heading level={1} size="display-lg">
                    {headline ?? content.headline}
                </Heading>
                <Text size="body-md" tone="muted">
                    {description ?? content.description}
                </Text>
            </div>

            <div className="sn-auth__panel-foot">
                <div className="sn-auth__trust">
                    {trustPoints.map((point) => (
                        <span key={point} className="sn-auth__trust-item">
                            <CheckCircle2 aria-hidden="true" className="sn-auth__trust-icon" />
                            {point}
                        </span>
                    ))}
                </div>
                <div className="sn-auth__contact">
                    <a href="tel:19006886" className="sn-auth__contact-link">
                        <Headset aria-hidden="true" className="sn-auth__contact-icon" />
                        1900 6886
                    </a>
                    <a href="mailto:hotro@shopnest.vn" className="sn-auth__contact-link">
                        <Mail aria-hidden="true" className="sn-auth__contact-icon" />
                        hotro@shopnest.vn
                    </a>
                </div>
            </div>
        </aside>
    );
}

export type { AuthBrandPanelProps, AuthRole };
export default AuthBrandPanel;
