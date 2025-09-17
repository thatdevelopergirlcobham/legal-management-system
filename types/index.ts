export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client
  role: UserRole;
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

// Add other types for Document, Appointment etc. as needed
