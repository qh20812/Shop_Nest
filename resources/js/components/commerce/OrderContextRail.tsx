import { MessageCircleQuestion } from 'lucide-react';

import { OrderAnnouncementCard, type OrderAnnouncementModel } from '@/components/commerce/OrderAnnouncementCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type OrderContextRailProps = {
    order: OrderAnnouncementModel;
    hints?: string[];
    onAsk?: (question: string) => void;
    className?: string;
};

const defaultHints = ['Đơn của tôi đang ở đâu?', 'Tôi muốn đổi địa chỉ giao hàng', 'Khi nào đơn được hoàn tiền?'];

export function OrderContextRail({ order, hints = defaultHints, onAsk, className }: OrderContextRailProps) {
    return (
        <aside
            aria-label="Ngữ cảnh đơn hàng"
            className={cn('flex h-full flex-col gap-4 overflow-y-auto border-l border-border bg-rice-paper/40 p-4', className)}
        >
            <div className="flex items-center gap-2">
                <MessageCircleQuestion aria-hidden="true" className="size-4 text-lacquer-red" />
                <h3 className="text-body-sm font-semibold text-ink">Đơn hàng đang trao đổi</h3>
            </div>

            <OrderAnnouncementCard order={order} />

            {hints.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="text-label-micro font-semibold tracking-[0.12em] text-ink-faint uppercase">Câu hỏi nhanh</span>
                    {hints.map((hint) => (
                        <Button
                            key={hint}
                            variant="secondary"
                            size="sm"
                            className="h-auto justify-start py-2 text-left whitespace-normal"
                            onClick={() => onAsk?.(hint)}
                        >
                            {hint}
                        </Button>
                    ))}
                </div>
            )}

            <p className="mt-auto text-label-micro text-ink-faint">
                Ngữ cảnh đơn hàng giúp shop trả lời nhanh hơn. Không chia sẻ thông tin thanh toán trong chat.
            </p>
        </aside>
    );
}

export type { OrderContextRailProps };
export default OrderContextRail;
