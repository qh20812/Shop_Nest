import React, { ReactNode } from 'react';

interface ShipperInfoCardProps {
    title: string;
    icon: string;
    children: ReactNode;
    actionButtons?: ReactNode;
}

export default function ShipperInfoCard({ title, icon, children, actionButtons }: ShipperInfoCardProps) {
    return (
        <div className="orders">
            <div className="header">
                <i className={icon}></i>
                <h3>{title}</h3>
                {actionButtons && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        {actionButtons}
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}
