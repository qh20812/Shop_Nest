import React from 'react';
import DailyDiscoverContent from './DailyDiscoverContent';

export default function DailyDiscoverSection() {
    return (
        <div className="home-component">
            <div className="daily-discover-title">
                <h2>gợi ý hôm nay</h2>
            </div>
            <DailyDiscoverContent />
        </div>
    );
}