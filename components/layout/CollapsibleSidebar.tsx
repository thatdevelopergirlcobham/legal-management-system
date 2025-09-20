'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserRole = 'ADMIN' | 'LAWYER' | 'CLIENT' | 'STAFF';

type CollapsibleSidebarProps = {
  links: { href: string; label: string; icon: React.ComponentType<{ className: string }> }[];
  role: UserRole;
};

export const CollapsibleSidebar = ({
  links,
  role
}: CollapsibleSidebarProps) => {
  // Add role-based class for future styling or functionality
  const roleClass = `role-${role.toLowerCase()}`;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`hidden md:flex flex-col border-r border-border bg-card/30 backdrop-blur-sm px-4 py-6 space-y-6 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} ${roleClass}`}> 
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors group"
          >
            <link.icon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>}
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
