'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ChatInterface } from './ChatInterface';
import { Skeleton } from '@/components/ui/skeleton';

// Define the Message type with all possible fields to avoid type conflicts
type Message = {
  _id: string;
  content: string;
  sender: string;
  senderId?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
};

type ChatSessionProps = {
  otherUserId: string;
};

export function ChatSession({ otherUserId }: ChatSessionProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Transform the data to ensure it matches the Message type
  interface MessageInput {
    _id?: string;
    id?: string;
    content: string;
    sender?: string;
    senderId?: string;
    read?: boolean;
    createdAt?: string;
    updatedAt?: string;
    timestamp?: string;
  }

  const transformMessages = useCallback((data: MessageInput[]): Message[] => {
    return data.map(msg => {
      const id = msg._id || msg.id || Math.random().toString(36).substring(2, 9);
      const timestamp = msg.timestamp || msg.createdAt || new Date().toISOString();
      
      return {
        _id: id,
        content: msg.content,
        sender: msg.sender || '',
        senderId: msg.senderId,
        read: msg.read || false,
        createdAt: msg.createdAt || timestamp,
        updatedAt: msg.updatedAt || timestamp,
        timestamp: timestamp
      };
    });
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?userId=${otherUserId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(transformMessages(Array.isArray(data) ? data : [data]));
        } else {
          setError('Failed to load messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('An error occurred while fetching messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Polling for new messages (temporary until we implement WebSockets)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId, otherUserId, transformMessages]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ChatInterface 
      userId={session?.user?.id || ''} 
      otherUserId={otherUserId} 
      initialMessages={messages} 
    />
  );
}
