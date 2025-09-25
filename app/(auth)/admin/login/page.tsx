import { Suspense } from 'react';
import AdminLoginForm from '@/components/auth/AdminLoginForm';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a192f] to-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}