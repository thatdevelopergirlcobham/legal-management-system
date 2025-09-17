'use client';
import Link from 'next/link';
import { Briefcase, Users } from 'lucide-react';

export const ClientSidebar = () => {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border px-5 py-6 space-y-6">
      <nav className="flex flex-col space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          My Dashboard
        </Link>
        <Link
          href="/cases"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          My Cases
        </Link>
        <Link
          href="/practitioners"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Users className="h-4 w-4 mr-2" />
          Practitioners
        </Link>
      </nav>
    </aside>
  );
};
