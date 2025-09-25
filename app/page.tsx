'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Briefcase, User, Shield } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function HomePage() {
  const { currentUser, isLoading } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      // Redirect based on user role
      switch (currentUser.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'STAFF':
          router.push('/dashboard/staff');
          break;
        case 'CLIENT':
          router.push('/client/dashboard');
          break;
      }
    }
  }, [currentUser, isLoading, router]);

  // If still loading or redirecting, don't render content yet
  if (isLoading || currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-5xl text-center space-y-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-50 to-slate-400 py-2">
          Anthony Otonnah & Sons
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Your trusted legal partners. Securely manage your cases and communicate with our team.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Link href="/admin/login" className="group block p-8 rounded-lg bg-card border border-border hover:border-primary/80 hover:bg-accent/30 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Shield className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Admin Portal</h2>
            <p className="text-muted-foreground text-center">Manage all aspects of the legal system. For administrative use only.</p>
          </Link>
          <Link href="/lawyer/login" className="group block p-8 rounded-lg bg-card border border-border hover:border-primary/80 hover:bg-accent/30 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Briefcase className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Lawyer Portal</h2>
            <p className="text-muted-foreground text-center">Access case management tools. For staff and legal professionals.</p>
          </Link>
          <Link href="/client/login" className="group block p-8 rounded-lg bg-card border border-border hover:border-primary/80 hover:bg-accent/30 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <User className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Client Portal</h2>
            <p className="text-muted-foreground text-center">Log in to view your case status or register as a new client with our firm.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
