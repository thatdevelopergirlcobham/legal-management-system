export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
  updatedAt: string;
  clientId: string;
  staffId: string;
}

export interface Document {
  id: string;
  name: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  caseId: string;
  uploadedBy: string;
  uploadedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  clientId: string;
  staffId: string;
  caseId?: string;
  location?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Add other types for Document, Appointment etc. as needed
