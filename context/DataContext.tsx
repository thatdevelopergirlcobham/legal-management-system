// context/DataContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  IUser, 
  ICase, 
  IAppointment, 
  IDocument, 
  IChatMessage,
  findUserByEmail,
  findUserById as findUserByIdMock,
  getAllCases,
  getAllAppointments,
  getAllDocuments,
  getAllChatMessages,
  getAllUsers,
  createCase as createCaseMock,
  updateCase as updateCaseMock,
  deleteCase as deleteCaseMock,
  createUser as createUserMock,
  createDocument as createDocumentMock
} from '@/lib/mockData';

interface DataContextType {
  currentUser: IUser | null;
  login: (email: string, password: string, expectedRole: 'CLIENT' | 'STAFF' | 'ADMIN') => Promise<IUser | null>;
  register: (name: string, email: string, password: string, role: 'CLIENT' | 'STAFF' | 'ADMIN') => Promise<IUser | null>;
  refreshUsers: () => Promise<void>;
  logout: () => void;
  users: IUser[];
  cases: ICase[];
  appointments: IAppointment[];
  documents: IDocument[];
  chatMessages: IChatMessage[];
  findUserById: (id: string) => Promise<IUser | null>;
  isLoading: boolean;
  createCase: (caseData: Omit<ICase, '_id' | 'createdAt' | 'updatedAt'>) => Promise<ICase>;
  updateCase: (id: string, updates: Partial<ICase>) => Promise<ICase | null>;
  deleteCase: (id: string) => Promise<boolean>;
  uploadDocument: (caseId: string, fileName: string) => Promise<IDocument>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'legal_cms_user';
const CASES_STORAGE_KEY = 'legal_cms_cases';
const APPOINTMENTS_STORAGE_KEY = 'legal_cms_appointments';
const DOCUMENTS_STORAGE_KEY = 'legal_cms_documents';
const CHAT_MESSAGES_STORAGE_KEY = 'legal_cms_chat_messages';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [cases, setCases] = useState<ICase[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from local storage on initial render
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Load mock data when user is authenticated
  useEffect(() => {
    const loadMockData = async () => {
      if (currentUser) {
        try {
          // Try to load from local storage first
          let casesData: ICase[] = [];
          let appointmentsData: IAppointment[] = [];
          let documentsData: IDocument[] = [];
          let messagesData: IChatMessage[] = [];
          
          try {
            const storedCases = localStorage.getItem(CASES_STORAGE_KEY);
            if (storedCases) {
              casesData = JSON.parse(storedCases);
            } else {
              casesData = await getAllCases();
              localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(casesData));
            }
            
            const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
            if (storedAppointments) {
              appointmentsData = JSON.parse(storedAppointments);
            } else {
              appointmentsData = await getAllAppointments();
              localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointmentsData));
            }
            
            const storedDocuments = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
            if (storedDocuments) {
              documentsData = JSON.parse(storedDocuments);
            } else {
              documentsData = await getAllDocuments();
              localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documentsData));
            }
            
            const storedMessages = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
            if (storedMessages) {
              messagesData = JSON.parse(storedMessages);
            } else {
              messagesData = await getAllChatMessages();
              localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messagesData));
            }
          } catch (storageError) {
            console.error('Error loading from local storage:', storageError);
            // Fallback to mock data if local storage fails
            casesData = await getAllCases();
            appointmentsData = await getAllAppointments();
            documentsData = await getAllDocuments();
            messagesData = await getAllChatMessages();
          }
          
          // Always get fresh users data
          const usersData = await getAllUsers();
          
          setUsers(usersData);
          setCases(casesData);
          setAppointments(appointmentsData);
          setDocuments(documentsData);
          setChatMessages(messagesData);
        } catch (error) {
          console.error('Error loading mock data:', error);
        }
      }
    };

    loadMockData();
  }, [currentUser]);

  const login = async (email: string, password: string, expectedRole: 'CLIENT' | 'STAFF' | 'ADMIN') => {
    try {
      const user = await findUserByEmail(email, password, expectedRole);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Store user in local storage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUser(null);
    setUsers([]);
    setCases([]);
    setAppointments([]);
    setDocuments([]);
    setChatMessages([]);
  };

  const findUserById = async (id: string) => {
    return await findUserByIdMock(id);
  };
  
  const createCase = async (caseData: Omit<ICase, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCase = await createCaseMock(caseData);
      // Update local state
      const updatedCases = [...cases, newCase];
      setCases(updatedCases);
      
      // Update local storage
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updatedCases));
      
      return newCase;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  };
  
  const updateCase = async (id: string, updates: Partial<ICase>) => {
    try {
      const updatedCase = await updateCaseMock(id, updates);
      if (updatedCase) {
        // Update local state
        const updatedCases = cases.map(c => c._id === id ? updatedCase : c);
        setCases(updatedCases);
        
        // Update local storage
        localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updatedCases));
      }
      return updatedCase;
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  };
  
  const refreshUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'CLIENT' | 'STAFF' | 'ADMIN') => {
    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        throw new Error('An account with this email already exists.');
      }

      const newUser = await createUserMock({ name, email, password, role });
      // Update local state with the new user
      setUsers(prevUsers => [...prevUsers, newUser]);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const uploadDocument = async (caseId: string, fileName: string) => {
    if (!currentUser) {
      throw new Error('You must be logged in to upload documents.');
    }

    const newDocumentData = {
      name: fileName,
      originalName: fileName,
      filePath: `/uploads/${fileName.toLowerCase().replace(/\s+/g, '-')}`,
      fileSize: Math.floor(Math.random() * 5 * 1024 * 1024), // Random size up to 5MB
      mimeType: 'application/pdf',
      caseId: caseId,
      uploadedBy: currentUser._id,
      uploadedAt: new Date(),
    };

    try {
      const newDoc = await createDocumentMock(newDocumentData);
      setDocuments(prev => [...prev, newDoc]);
      return newDoc;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const deleteCase = async (id: string) => {
    try {
      const success = await deleteCaseMock(id);
      if (success) {
        // Update local state
        const updatedCases = cases.filter(c => c._id !== id);
        setCases(updatedCases);
        
        // Update local storage
        localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updatedCases));
      }
      return success;
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider 
      value={{ 
        currentUser, 
        login, 
        register,
        refreshUsers,
        logout, 
        users,
        cases, 
        appointments, 
        documents, 
        chatMessages, 
        findUserById,
        isLoading,
        createCase,
        updateCase,
        deleteCase,
        uploadDocument
      }}
    >
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