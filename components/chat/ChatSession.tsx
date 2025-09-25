'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ChatInterface } from './ChatInterface';
import { Skeleton } from '@/components/ui/skeleton';

type ChatSessionProps = {
  otherUserId: string;
};

export function ChatSession({ otherUserId }: ChatSessionProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?userId=${otherUserId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else {
          setError('Failed to load messages');
        }
      } catch (err) {
        setError('An error occurred while fetching messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Polling for new messages (temporary until we implement WebSockets)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [session?.user?.id, otherUserId]);

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
