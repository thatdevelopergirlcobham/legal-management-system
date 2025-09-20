'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import { LogOut, Briefcase, Users, Calendar, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleSidebar } from '@/components/layout/CollapsibleSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'STAFF')) {
      router.push('/admin/login');
    }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'STAFF')) {
    return null;
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard as React.ComponentType<{ className: string }> },
    { href: '/dashboard/cases', label: 'Cases', icon: Briefcase as React.ComponentType<{ className: string }> },
    { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar as React.ComponentType<{ className: string }> },
    ...(currentUser.role === 'ADMIN' ? [{ href: '/dashboard/admin/users', label: 'User Management', icon: Users as React.ComponentType<{ className: string }> }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            <Link href="/dashboard">Legal CMS - Practitioner</Link>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            {currentUser.name} ({currentUser.role})
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <CollapsibleSidebar links={links} role={currentUser.role} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};
