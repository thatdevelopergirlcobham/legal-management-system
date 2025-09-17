'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Case } from '@/types';

// NOTE: In a real app, this data comes from an API.
const mockUsers: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@legalcms.com', password: 'password', role: 'ADMIN' },
  { id: 'user-2', name: 'John Doe', email: 'john.doe@legalcms.com', password: 'password', role: 'STAFF' },
  { id: 'user-3', name: 'Alice Johnson', email: 'alice.j@email.com', password: 'password', role: 'CLIENT' },
];
const mockCases: Case[] = [
  { id: 'case-1', caseNumber: 'LCS-2025-001', title: 'Corporate Merger Agreement', description: '...', status: 'In Progress', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), clientId: 'user-3', staffId: 'user-2' },
];
const mockDocuments = [
  { id: 'doc-1', caseId: 'case-1', name: 'Merger Agreement Draft.pdf', uploadedAt: new Date().toISOString() },
];

interface Document {
  id: string;
  caseId: string;
  name: string;
  uploadedAt: string;
}

interface DataContextType {
  currentUser: User | null;
  login: (email: string, password: string, roleType: 'practitioner' | 'client') => User | null;
  logout: () => void;
  register: (name: string, email: string, password: string) => User;
  cases: Case[];
  users: User[];
  documents: Document[];
  createCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;
  findUserById: (userId: string) => User | undefined;
  uploadDocument: (caseId: string, documentName: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, roleType: 'practitioner' | 'client') => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      if (roleType === 'practitioner' && (user.role === 'ADMIN' || user.role === 'STAFF')) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return user;
      } else if (roleType === 'client' && user.role === 'CLIENT') {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return user;
      } else {
        return null;
      }
    }
    return null;
  };

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const register = (name: string, email: string, password: string) => {
    if (users.find(u => u.email === email)) {
      throw new Error('User with this email already exists.');
    }
    const newUser: User = { id: `user-${Date.now()}` , name, email, password, role: 'CLIENT' };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const createCase = (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCase: Case = {
      ...caseData,
      id: `case-${Date.now()}` ,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCases(prev => [...prev, newCase]);
  };

  const updateCase = (caseId: string, updates: Partial<Case>) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const deleteCase = (caseId: string) => {
    setCases(prev => prev.filter(c => c.id !== caseId));
  };

  const findUserById = (userId: string) => users.find(u => u.id === userId);

  const uploadDocument = (caseId: string, documentName: string) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      caseId,
      name: documentName,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const value = { currentUser, login, logout, register, cases, users, documents, createCase, updateCase, deleteCase, findUserById, uploadDocument };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
