// lib/mockData.ts
"use server";

// Types for our mock data
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICase {
  _id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  clientId: string;
  staffId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAppointment {
  _id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  clientId: string;
  staffId: string;
  caseId?: string;
  location?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDocument {
  _id: string;
  name: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  caseId: string;
  uploadedBy: string;
  uploadedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChatMessage {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock data storage
let users: (IUser & { comparePassword?: (candidatePassword: string) => Promise<boolean> })[] = [];
let cases: ICase[] = [];
let appointments: IAppointment[] = [];
let documents: IDocument[] = [];
let chatMessages: IChatMessage[] = [];

// Initialize mock data with the required credentials
function initializeMockData() {
  if (users.length === 0) {
    users = [
      {
        _id: 'admin-001',
        name: 'System Administrator',
        email: 'admin@legal.com',
        password: 'admin123',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        comparePassword: async (candidatePassword: string) => {
          return candidatePassword === 'admin123';
        }
      },
      {
        _id: 'client-001',
        name: 'John Client',
        email: 'client@legal.com',
        password: 'client123',
        role: 'CLIENT',
        createdAt: new Date(),
        updatedAt: new Date(),
        comparePassword: async (candidatePassword: string) => {
          return candidatePassword === 'client123';
        }
      },
      {
        _id: 'lawyer-001',
        name: 'Sarah Lawyer',
        email: 'lawyer@legal.com',
        password: 'lawyer123',
        role: 'STAFF',
        createdAt: new Date(),
        updatedAt: new Date(),
        comparePassword: async (candidatePassword: string) => {
          return candidatePassword === 'lawyer123';
        }
      }
    ];

    cases = [
      {
        _id: 'case-001',
        caseNumber: 'CASE-2024-001',
        title: 'Personal Injury Claim',
        description: 'Client seeking compensation for workplace injury',
        status: 'Open',
        clientId: 'client-001',
        staffId: 'lawyer-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'case-002',
        caseNumber: 'CASE-2024-002',
        title: 'Contract Dispute',
        description: 'Breach of contract case against former employer',
        status: 'In Progress',
        clientId: 'client-001',
        staffId: 'lawyer-001',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    appointments = [
      {
        _id: 'appointment-001',
        title: 'Initial Consultation',
        description: 'First meeting to discuss case details',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 60,
        status: 'Scheduled',
        clientId: 'client-001',
        staffId: 'lawyer-001',
        caseId: 'case-001',
        location: 'Office Conference Room A',
        notes: 'Please bring all relevant documents',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    documents = [
      {
        _id: 'document-001',
        name: 'medical-report.pdf',
        originalName: 'Medical Report.pdf',
        filePath: '/uploads/medical-report.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        caseId: 'case-001',
        uploadedBy: 'client-001',
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    chatMessages = [
      {
        _id: 'message-001',
        sender: 'client-001',
        recipient: 'lawyer-001',
        content: 'Hello, I have some questions about my case.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'message-002',
        sender: 'lawyer-001',
        recipient: 'client-001',
        content: "Hi John, I'd be happy to help. What questions do you have?",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        read: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}

// User operations
export async function findUserByEmail(email: string, password?: string, expectedRole?: 'CLIENT' | 'STAFF' | 'ADMIN'): Promise<IUser | null> {
  initializeMockData();
  const user = users.find(user => user.email === email);
  if (!user) return null;

  if (password && expectedRole) {
    const isPasswordValid = await user.comparePassword?.(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    if (user.role !== expectedRole) {
      throw new Error(`Access denied: ${expectedRole} role required`);
    }
  }

  // Return a plain user object without the comparePassword function
  const { comparePassword, ...plainUser } = user;
  return plainUser;
}

export async function findUserById(id: string): Promise<IUser | null> {
  initializeMockData();
  const user = users.find(user => user._id === id);
  if (!user) return null;
  const { comparePassword, ...plainUser } = user;
  return plainUser;
}

export async function createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
  initializeMockData();
  const newUser: IUser & { comparePassword?: (candidatePassword: string) => Promise<boolean> } = {
    _id: `user-${Date.now()}`,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: async (candidatePassword: string) => {
      return candidatePassword === userData.password;
    }
  };
  users.push(newUser);
  const {  ...plainUser } = newUser;
  return plainUser;
}

export async function getAllUsers(): Promise<IUser[]> {
  initializeMockData();
  return users.map(({ comparePassword, ...user }) => user);
}

// Case operations
export async function getAllCases(): Promise<ICase[]> {
  initializeMockData();
  return cases;
}

export async function findCaseById(id: string): Promise<ICase | null> {
  initializeMockData();
  return cases.find(c => c._id === id) || null;
}

export async function createCase(caseData: Omit<ICase, '_id' | 'createdAt' | 'updatedAt'>): Promise<ICase> {
  initializeMockData();
  const newCase: ICase = {
    _id: `case-${Date.now()}`,
    ...caseData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  cases.push(newCase);
  return newCase;
}

export async function updateCase(id: string, updates: Partial<ICase>): Promise<ICase | null> {
  initializeMockData();
  const caseIndex = cases.findIndex(c => c._id === id);
  if (caseIndex === -1) return null;

  cases[caseIndex] = { ...cases[caseIndex], ...updates, updatedAt: new Date() };
  return cases[caseIndex];
}

export async function deleteCase(id: string): Promise<boolean> {
  initializeMockData();
  const initialLength = cases.length;
  cases = cases.filter(c => c._id !== id);
  return cases.length < initialLength;
}

// Appointment operations
export async function getAllAppointments(): Promise<IAppointment[]> {
  initializeMockData();
  return appointments;
}

export async function findAppointmentById(id: string): Promise<IAppointment | null> {
  initializeMockData();
  return appointments.find(a => a._id === id) || null;
}

export async function createAppointment(appointmentData: Omit<IAppointment, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAppointment> {
  initializeMockData();
  const newAppointment: IAppointment = {
    _id: `appointment-${Date.now()}`,
    ...appointmentData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  appointments.push(newAppointment);
  return newAppointment;
}

export async function updateAppointment(id: string, updates: Partial<IAppointment>): Promise<IAppointment | null> {
  initializeMockData();
  const appointmentIndex = appointments.findIndex(a => a._id === id);
  if (appointmentIndex === -1) return null;

  appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...updates, updatedAt: new Date() };
  return appointments[appointmentIndex];
}

export async function deleteAppointment(id: string): Promise<boolean> {
  initializeMockData();
  const initialLength = appointments.length;
  appointments = appointments.filter(a => a._id !== id);
  return appointments.length < initialLength;
}

// Document operations
export async function getAllDocuments(): Promise<IDocument[]> {
  initializeMockData();
  return documents;
}

export async function findDocumentById(id: string): Promise<IDocument | null> {
  initializeMockData();
  return documents.find(d => d._id === id) || null;
}

export async function createDocument(documentData: Omit<IDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<IDocument> {
  initializeMockData();
  const newDocument: IDocument = {
    _id: `document-${Date.now()}`,
    ...documentData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  documents.push(newDocument);
  return newDocument;
}

export async function deleteDocument(id: string): Promise<boolean> {
  initializeMockData();
  const initialLength = documents.length;
  documents = documents.filter(d => d._id !== id);
  return documents.length < initialLength;
}

// Chat operations
export async function getAllChatMessages(): Promise<IChatMessage[]> {
  initializeMockData();
  return chatMessages;
}

export async function findChatMessageById(id: string): Promise<IChatMessage | null> {
  initializeMockData();
  return chatMessages.find(m => m._id === id) || null;
}

export async function createChatMessage(messageData: Omit<IChatMessage, '_id' | 'createdAt' | 'updatedAt'>): Promise<IChatMessage> {
  initializeMockData();
  const newMessage: IChatMessage = {
    _id: `message-${Date.now()}`,
    ...messageData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  chatMessages.push(newMessage);
  return newMessage;
}

export async function getChatMessagesBetweenUsers(userId1: string, userId2: string): Promise<IChatMessage[]> {
  initializeMockData();
  return chatMessages
    .filter(msg =>
      (msg.sender === userId1 && msg.recipient === userId2) ||
      (msg.sender === userId2 && msg.recipient === userId1)
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export async function updateChatMessage(id: string, updates: Partial<IChatMessage>): Promise<IChatMessage | null> {
  initializeMockData();
  const messageIndex = chatMessages.findIndex(m => m._id === id);
  if (messageIndex === -1) return null;

  chatMessages[messageIndex] = { ...chatMessages[messageIndex], ...updates, updatedAt: new Date() };
  return chatMessages[messageIndex];
}

export async function deleteChatMessage(id: string): Promise<boolean> {
  initializeMockData();
  const initialLength = chatMessages.length;
  chatMessages = chatMessages.filter(m => m._id !== id);
  return chatMessages.length < initialLength;
}