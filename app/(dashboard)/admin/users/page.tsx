'use client';
import { UserTable } from '@/components/admin/UserTable';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <UserTable />
    </div>
  );
};
