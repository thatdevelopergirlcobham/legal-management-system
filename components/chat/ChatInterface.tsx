'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
};

type ChatInterfaceProps = {
  userId: string;
  otherUserId: string;
  initialMessages: Message[];
};

export function ChatInterface({ userId, otherUserId, initialMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: otherUserId,
          content: newMessage,
        }),
      });
      
      if (response.ok) {
        const sentMessage = await response.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted">
        <h3 className="font-semibold">Chat</h3>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`flex mb-4 ${message.sender === userId ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== userId && (
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>{otherUserId.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`max-w-xs p-3 rounded-lg ${message.sender === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      <div className="p-4 border-t flex gap-2">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
}
