'use client';
import { useData } from '@/context/DataContext';
import { StaffDashboard } from '@/components/staff/StaffDashboard';

export default function StaffDashboardPage() {
  const { currentUser } = useData();

  if (!currentUser || currentUser.role !== 'STAFF') {
    return null;
  }

  return (
    <div className="space-y-6">
      <StaffDashboard />
    </div>
  );
};
