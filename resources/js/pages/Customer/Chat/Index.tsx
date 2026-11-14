import { Head } from '@inertiajs/react';

import { ChatWorkspace } from '@/components/chat/ChatWorkspace';
import { AccountLayout } from '@/components/layout/AccountLayout';

export default function ChatIndex() {
    return (
        <AccountLayout
            active="messages"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Tin nhắn' }]}
            eyebrow="Tài khoản"
            title="Tin nhắn"
            description="Trao đổi với shop, người bán hoặc bộ phận hỗ trợ của ShopNest."
        >
            <Head title="Tin nhắn" />

            <ChatWorkspace />
        </AccountLayout>
    );
}
