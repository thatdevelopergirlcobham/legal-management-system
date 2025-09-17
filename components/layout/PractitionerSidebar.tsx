'use client';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import { Briefcase, Users, Calendar, LayoutDashboard } from 'lucide-react';

export const PractitionerSidebar = () => {
  const { currentUser } = useData();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border px-5 py-6 space-y-6">
      <nav className="flex flex-col space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Link>
        <Link
          href="/cases"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Cases
        </Link>
        <Link
          href="/appointments"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Appointments
        </Link>
        {currentUser?.role === 'ADMIN' && (
          <Link
            href="/admin/users"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Link>
        )}
      </nav>
    </aside>
  );
};
