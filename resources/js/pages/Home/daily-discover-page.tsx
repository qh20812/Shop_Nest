import { Head, Link } from '@inertiajs/react';
import { Compass } from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function DailyDiscoverPage() {
    return (
        <StorefrontLayout compactFooter>
            <Head title="Khám phá hàng ngày" />
            <PageContainer className="py-section">
                <PageHeader eyebrow="Dành cho bạn" title="Khám phá hàng ngày" description="Những món được tuyển chọn theo nhu cầu của bạn." />
                <div className="mt-8">
                    <EmptyState
                        icon={Compass}
                        title="Trang khám phá đang được hoàn thiện"
                        description="Trong lúc chờ, bạn có thể tìm món đồ cho tổ ấm bằng tìm kiếm hoặc danh mục."
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
