import { MessageCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type ChatbotLauncherProps = React.ComponentPropsWithoutRef<'button'> & {
    unreadCount?: number;
    open?: boolean;
    className?: string;
};

const ChatbotLauncher = React.forwardRef<HTMLButtonElement, ChatbotLauncherProps>(({ unreadCount = 0, open = false, className, ...props }, ref) => (
    <button
        ref={ref}
        type="button"
        aria-label={open ? 'Đóng trợ lý ShopNest' : 'Mở trợ lý ShopNest'}
        title="Trợ lý ShopNest"
        data-slot="chatbot-launcher"
        className={cn(
            'z-chat focus-ring fixed right-4 bottom-4 flex size-chat-launcher items-center justify-center rounded-pill border border-lacquer-deep bg-lacquer-red text-warm-porcelain shadow-float transition-[background-color,transform,opacity] duration-150 ease-nep hover:bg-lacquer-deep active:scale-95 md:right-6 md:bottom-6',
            open && 'pointer-events-none opacity-0',
            className,
        )}
        {...props}
    >
        <MessageCircle aria-hidden="true" className="size-6" strokeWidth={1.75} />
        {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-pill border border-border bg-warm-porcelain px-1 font-mono text-label-micro font-semibold text-lacquer-deep">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
        )}
    </button>
));

ChatbotLauncher.displayName = 'ChatbotLauncher';

export { ChatbotLauncher };
export type { ChatbotLauncherProps };
export default ChatbotLauncher;
