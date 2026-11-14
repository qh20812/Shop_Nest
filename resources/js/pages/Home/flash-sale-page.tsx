import { Head, Link } from '@inertiajs/react';
import { Flame } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function FlashSalePage() {
    return (
        <StorefrontLayout compactFooter>
            <Head title="Flash sale" />
            <PageContainer className="py-section">
                <PageHeader eyebrow="Giờ vàng" title="Flash sale" description="Ưu đãi giới hạn trong ngày từ các shop Việt đã kiểm duyệt." />
                <div className="mt-8">
                    <EmptyState
                        icon={Flame}
                        title="Chưa có flash sale đang diễn ra"
                        description="Các ưu đãi chớp nhoáng sẽ xuất hiện tại đây. Bạn có thể xem toàn bộ chợ trước."
                        actions={
                            <Button asChild>
                                <Link href="/search">Xem chợ hôm nay</Link>
                            </Button>
                        }
                    />
                </div>
            </PageContainer>
        </StorefrontLayout>
    );
}
