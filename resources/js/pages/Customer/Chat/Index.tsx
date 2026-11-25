import { Head } from '@inertiajs/react';

import { ChatWorkspace } from '@/components/chat/ChatWorkspace';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { useTranslation } from '@/lib/i18n';

export default function ChatIndex() {
    const { t } = useTranslation();
    return (
        <AccountLayout
            active="messages"
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Account') }, { label: t('Messages') }]}
            eyebrow={t('Account')}
            title={t('Messages')}
            description={t('Chat with shops, sellers or the ShopNest support team.')}
        >
            <Head title={t('Messages')} />

            <ChatWorkspace />
        </AccountLayout>
    );
}
