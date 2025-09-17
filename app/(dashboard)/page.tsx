'use client';
import { useData } from '@/context/DataContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { StaffDashboard } from '@/components/staff/StaffDashboard';

export default function DashboardPage() {
  const { currentUser } = useData();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      {currentUser.role === 'ADMIN' ? <AdminDashboard /> : <StaffDashboard />}
    </div>
  );
};
