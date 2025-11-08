/** @jsxImportSource react */
import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import ShipperProfile from '@/components/shipper/ShipperProfile';
import StatsGrid from '@/components/shipper/StatsGrid';
import JourneysTable from '@/components/shipper/JourneysTable';
import RatingsList from '@/components/shipper/RatingsList';

export default function ShipperDashboard() {
  const { props } = usePage();
  const stats = props.stats ?? {
    today_orders: 0,
    total_earnings: '0₫',
    average_rating: '5.0',
    status: 'OFFLINE'
  };
  const journeys = props.journeys ?? [];
  const recentRatings = props.recentRatings ?? [];
  const shipper = props.shipper ?? { name: '', avatar_url: null, status: 'inactive' };

  const handleStatusUpdate = async (journeyId: number, status: string) => {
    try {
      const response = await fetch(`/shipper/journeys/${journeyId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <AppLayout>
      <Head title="Shipper Dashboard" />

      <div className="p-6">
        <ShipperProfile
          name={shipper.name}
          avatarUrl={shipper.avatar_url}
          status={shipper.status}
        />

        <StatsGrid stats={stats} />

        <JourneysTable
          journeys={journeys}
          onStatusUpdate={handleStatusUpdate}
        />

        <RatingsList ratings={recentRatings} />
      </div>
    </AppLayout>
  );
}