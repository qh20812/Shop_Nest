import { Link } from '@inertiajs/react';
import { CheckCircle2, Headset, Mail, ShieldCheck, Sparkles, Store, Truck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type AuthRole = 'customer' | 'seller' | 'shipper';

type AuthBrandPanelProps = {
    role?: AuthRole;
    eyebrow?: string;
    headline?: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
    className?: string;
};

const roleContent: Record<AuthRole, { label: string; eyebrow: string; headline: string; description: string; image: string; icon: typeof Store }> = {
    customer: {
        label: 'Khách hàng',
        eyebrow: 'Chợ nhỏ, tổ ấm',
        headline: 'Đồ thật, người thật, chuyện thật.',
        description: 'Mọi thứ cho tổ ấm Việt: điện tử, gia dụng, nhà cửa, mẹ & bé, thời trang và làm đẹp từ các shop đã kiểm duyệt.',
        image: 'https://picsum.photos/seed/shopnest-market/1000/1200',
        icon: Sparkles,
    },
    seller: {
        label: 'Người bán',
        eyebrow: 'Dành cho người bán',
        headline: 'Mang gian hàng của bạn đến đúng người.',
        description: 'ShopNest tuyển chọn nhà bán tử tế, minh bạch nguồn gốc và đồng hành từ gian hàng đến đơn hàng đầu tiên.',
        image: 'https://picsum.photos/seed/shopnest-seller/1000/1200',
        icon: Store,
    },
    shipper: {
        label: 'Đối tác giao vận',
        eyebrow: 'Dành cho đối tác giao vận',
        headline: 'Mỗi kiện hàng, một chặng đường êm.',
        description: 'Tham gia mạng lưới giao vận ShopNest, nhận đơn rõ ràng và đồng hành cùng hàng nghìn tổ ấm Việt.',
        image: 'https://picsum.photos/seed/shopnest-delivery/1000/1200',
        icon: Truck,
    },
};

const trustPoints = ['Shop Việt đã kiểm duyệt', 'Đổi trả 7 ngày', 'Hỗ trợ 24/7'];

export function AuthBrandPanel({ role = 'customer', eyebrow, headline, description, imageUrl, imageAlt, className }: AuthBrandPanelProps) {
    const content = roleContent[role];
    const RoleIcon = content.icon;

    return (
        <aside className={cn('flex h-full flex-col justify-between bg-rice-paper p-8 lg:p-12 xl:p-16', className)}>
            <div className="flex flex-col gap-10">
                <Link href="/" className="focus-ring flex w-fit items-center gap-3 rounded-chip">
                    <img src="/image/ShopnestLogo.png" alt="ShopNest" className="size-11 object-contain" />
                    <div className="flex flex-col">
                        <span className="text-headline-3 font-semibold text-ink">ShopNest</span>
                        <span className="text-body-sm text-ink-muted">Chợ đời sống & tổ ấm Việt</span>
                    </div>
                </Link>

                <div className="flex max-w-lg flex-col gap-4">
                    <Eyebrow tone="accent">{eyebrow ?? content.eyebrow}</Eyebrow>
                    <Heading level={1} size="display-lg" serif className="max-w-[12ch]">
                        {headline ?? content.headline}
                    </Heading>
                    <Text size="body-md" tone="muted">
                        {description ?? content.description}
                    </Text>
                    <Badge tone="accent" icon={RoleIcon} size="md" className="mt-1 w-fit">
                        {content.label}
                    </Badge>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-surface border border-border bg-warm-porcelain p-2">
                    <img
                        src={imageUrl ?? content.image}
                        alt={imageAlt ?? 'Không gian chợ Việt của ShopNest'}
                        className="size-full rounded-card object-cover"
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6">
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {trustPoints.map((point) => (
                        <span key={point} className="inline-flex items-center gap-1.5 text-body-sm text-ink-muted">
                            <CheckCircle2 aria-hidden="true" className="size-4 text-jade" />
                            {point}
                        </span>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-body-sm text-ink-muted">
                    <a href="tel:19006886" className="inline-flex items-center gap-1.5 transition-colors hover:text-lacquer-red">
                        <Headset aria-hidden="true" className="size-4" />
                        1900 6886
                    </a>
                    <a href="mailto:hotro@shopnest.vn" className="inline-flex items-center gap-1.5 transition-colors hover:text-lacquer-red">
                        <Mail aria-hidden="true" className="size-4" />
                        hotro@shopnest.vn
                    </a>
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck aria-hidden="true" className="size-4 text-jade" />
                        Bảo mật đa tầng
                    </span>
                </div>
            </div>
        </aside>
    );
}

export type { AuthBrandPanelProps, AuthRole };
export default AuthBrandPanel;
