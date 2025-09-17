'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CollapsibleSidebar = ({ links, role }: { links: { href: string; label: string; icon: React.ComponentType<{ className: string }> }[]; role: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`hidden md:flex flex-col border-r border-border px-5 py-6 space-y-6 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}> 
      <nav className="flex flex-col space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <link.icon className="h-4 w-4 mr-2" />
            {!isCollapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mt-auto flex justify-center"
      >
        {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>
    </aside>
  );
};
