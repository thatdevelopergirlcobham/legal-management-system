'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Case, Document, Appointment } from '@/types';

interface DataContextType {
  currentUser: User | null;
  login: (email: string, password: string, roleType: 'practitioner' | 'client') => Promise<User | null>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: string) => Promise<User>;
  cases: Case[];
  users: User[];
  documents: Document[];
  appointments: Appointment[];
  createCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCase: (caseId: string, updates: Partial<Case>) => Promise<void>;
  deleteCase: (caseId: string) => Promise<void>;
  findUserById: (userId: string) => User | undefined;
  uploadDocument: (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (appointmentId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshCases: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, roleType: 'practitioner' | 'client') => {
    try {
      await connectToDatabase();
      const user = await UserModel.findOne({ email }).select('+password');

      if (user && await user.comparePassword(password)) {
        // Return a clean plain object without Mongoose properties
        const userObj = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt?.toISOString(),
          updatedAt: user.updatedAt?.toISOString()
        };
        
        if (roleType === 'practitioner' && (user.role === 'ADMIN' || user.role === 'STAFF')) {
          sessionStorage.setItem('currentUser', JSON.stringify(userObj));
          setCurrentUser(userObj);
          return userObj;
        } else if (roleType === 'client' && user.role === 'CLIENT') {
          sessionStorage.setItem('currentUser', JSON.stringify(userObj));
          setCurrentUser(userObj);
          return userObj;
        } else {
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const createCase = async (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create case');
      }

      await refreshCases();
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  };

  const updateCase = async (caseId: string, updates: Partial<Case>) => {
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update case');
      }

      await refreshCases();
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  };

  const deleteCase = async (caseId: string) => {
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete case');
      }

      await refreshCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  };

  const uploadDocument = async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await connectToDatabase();

      const newDocument = new DocumentModel({
        ...documentData,
        uploadedAt: new Date().toISOString()
      });

      await newDocument.save();
      await refreshDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await connectToDatabase();

      const deletedDocument = await DocumentModel.findByIdAndDelete(documentId);
      if (!deletedDocument) {
        throw new Error('Document not found');
      }

      await refreshDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await connectToDatabase();

      const newAppointment = new AppointmentModel({
        ...appointmentData,
        status: appointmentData.status || 'Scheduled'
      });

      await newAppointment.save();
      await refreshAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      await connectToDatabase();

      const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
        appointmentId,
        updates,
        { new: true, runValidators: true }
      );

      if (!updatedAppointment) {
        throw new Error('Appointment not found');
      }

      await refreshAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      await connectToDatabase();

      const deletedAppointment = await AppointmentModel.findByIdAndDelete(appointmentId);
      if (!deletedAppointment) {
        throw new Error('Appointment not found');
      }

      await refreshAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  const findUserById = (userId: string) => users.find(u => u.id === userId);

  const refreshUsers = async () => {
    try {
      await connectToDatabase();
      const dbUsers = await UserModel.find({});
      setUsers(dbUsers.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString()
      })));
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const refreshCases = async () => {
    try {
      await connectToDatabase();
      const dbCases = await CaseModel.find({})
        .populate('clientId', 'name email')
        .populate('staffId', 'name email')
        .sort({ updatedAt: -1 });
      setCases(dbCases.map(caseDoc => ({
        id: caseDoc._id.toString(),
        caseNumber: caseDoc.caseNumber,
        title: caseDoc.title,
        description: caseDoc.description,
        status: caseDoc.status,
        createdAt: caseDoc.createdAt?.toISOString(),
        updatedAt: caseDoc.updatedAt?.toISOString(),
        clientId: caseDoc.clientId?._id?.toString() || caseDoc.clientId,
        staffId: caseDoc.staffId?._id?.toString() || caseDoc.staffId
      })));
    } catch (error) {
      console.error('Error refreshing cases:', error);
    }
  };

  const refreshDocuments = async () => {
    try {
      await connectToDatabase();
      const dbDocuments = await DocumentModel.find({})
        .populate('caseId', 'caseNumber title')
        .populate('uploadedBy', 'name email')
        .sort({ uploadedAt: -1 });
      setDocuments(dbDocuments.map(doc => ({
        id: doc._id.toString(),
        name: doc.name,
        originalName: doc.originalName,
        filePath: doc.filePath,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        caseId: doc.caseId?._id?.toString() || doc.caseId,
        uploadedBy: doc.uploadedBy?._id?.toString() || doc.uploadedBy,
        uploadedAt: doc.uploadedAt?.toISOString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString()
      })));
    } catch (error) {
      console.error('Error refreshing documents:', error);
    }
  };

  const refreshAppointments = async () => {
    try {
      await connectToDatabase();
      const dbAppointments = await AppointmentModel.find({})
        .populate('clientId', 'name email')
        .populate('staffId', 'name email')
        .populate('caseId', 'caseNumber title')
        .sort({ date: 1 });
      setAppointments(dbAppointments.map(apt => ({
        id: apt._id.toString(),
        title: apt.title,
        description: apt.description,
        date: apt.date?.toISOString(),
        duration: apt.duration,
        status: apt.status,
        clientId: apt.clientId?._id?.toString() || apt.clientId,
        staffId: apt.staffId?._id?.toString() || apt.staffId,
        caseId: apt.caseId?._id?.toString() || apt.caseId,
        location: apt.location,
        notes: apt.notes,
        createdAt: apt.createdAt?.toISOString(),
        updatedAt: apt.updatedAt?.toISOString()
      })));
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    cases,
    users,
    documents,
    appointments,
    createCase,
    updateCase,
    deleteCase,
    findUserById,
    uploadDocument,
    deleteDocument,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshUsers,
    refreshCases,
    refreshDocuments,
    refreshAppointments
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
