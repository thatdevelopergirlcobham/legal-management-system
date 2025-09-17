'use client';
import { useData } from '@/context/DataContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  const { currentUser } = useData();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-6">
      <AdminDashboard />
    </div>
  );
};
