'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import { LogOut, Briefcase, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleSidebar } from '@/components/layout/CollapsibleSidebar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout, isLoading } = useData();
  const router = useRouter();

  useEffect(() => {
    // If loading is complete and user is not logged in or is not a client, redirect appropriately
    if (!isLoading) {
      if (!currentUser) {
        router.push('/');
      } else if (currentUser.role !== 'CLIENT') {
        // Redirect non-clients to their appropriate dashboard
        if (currentUser.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (currentUser.role === 'STAFF') {
          router.push('/dashboard/staff');
        }
      }
    }
  }, [currentUser, isLoading, router]);

  // Show loading state or nothing if user shouldn't access this layout
  if (isLoading || !currentUser || currentUser.role !== 'CLIENT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {isLoading ? <div className="animate-pulse text-lg">Loading...</div> : null}
      </div>
    );
  }

  const links = [
    { href: '/client/dashboard', label: 'My Dashboard', icon: Briefcase as React.ComponentType<{ className: string }> },
    { href: '/client/cases', label: 'My Cases', icon: FileText as React.ComponentType<{ className: string }> },
    { href: '/client/practitioners', label: 'Practitioners', icon: Users as React.ComponentType<{ className: string }> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a192f] to-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">
            <Link href="/client/dashboard">Legal CMS - Client</Link>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            {currentUser.name}
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
