'use client';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AdminDashboard = () => {
  const { users, cases, isLoading } = useData();
  const router = useRouter();

  const totalUsers = users?.length || 0;
  const totalCases = cases?.length || 0;
  const activePractitioners = users?.filter(u => u.role === 'ADMIN' || u.role === 'STAFF').length || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Cases</CardTitle>
            <CardDescription>All cases in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Practitioners</CardTitle>
            <CardDescription>Admin and staff members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activePractitioners}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex space-x-4">
        <Button onClick={() => router.push('/admin/users')}>
          <Users className="h-4 w-4 mr-2" />
          Manage Users
        </Button>
        <Button onClick={() => router.push('/cases')}>
          <Briefcase className="h-4 w-4 mr-2" />
          Manage Cases
        </Button>
      </div>
    </div>
  );
};
