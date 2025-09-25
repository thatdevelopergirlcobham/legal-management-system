// context/DataContext.tsx
'use client';

import { createContext, useContext } from 'react';
import { IUser } from '@/lib/mockData';
import { userToPlain } from '@/lib/mockDataUtils';

interface DataContextType {
  login: (email: string, password: string, expectedRole: 'CLIENT' | 'STAFF' | 'ADMIN') => Promise<IUser | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Hardcoded login credentials
const HARDCODED_USERS = [
  {
    _id: 'client-001',
    name: 'John Client',
    email: 'client@legal.com',
    password: 'client123',
    role: 'CLIENT' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'lawyer-001',
    name: 'Sarah Lawyer',
    email: 'lawyer@legal.com',
    password: 'lawyer123',
    role: 'STAFF' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'admin-001',
    name: 'System Administrator',
    email: 'admin@legal.com',
    password: 'admin123',
    role: 'ADMIN' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const login = async (email: string, password: string, expectedRole: 'CLIENT' | 'STAFF' | 'ADMIN') => {
    try {
      // Find user with matching email and password
      const user = HARDCODED_USERS.find(u =>
        u.email === email &&
        u.password === password &&
        u.role === expectedRole
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      return userToPlain(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ login }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}