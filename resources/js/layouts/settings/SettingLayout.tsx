import SettingsSidebar from '@/components/settings/SettingSidebar';
import React from 'react';
import AppLayout from '../app/AppLayout';

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <AppLayout>
            <div style={{ display: 'flex', gap: '24px', minHeight: '600px' }}>
                {/* Settings Sidebar */}
                <SettingsSidebar />

                {/* Settings Content */}
                <div style={{ flex: 1 }}>{children}</div>
            </div>
        </AppLayout>
    );
}
