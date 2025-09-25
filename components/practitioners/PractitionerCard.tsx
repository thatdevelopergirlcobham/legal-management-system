'use client';
import { useState } from 'react';
import { IUser } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatModal } from '@/components/shared/ChatModal';

export const PractitionerCard = ({ practitioner }: { practitioner: IUser }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{practitioner.name}</CardTitle>
        <CardDescription>{practitioner.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsChatOpen(true)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </Button>
        {isChatOpen && (
          <ChatModal recipientName={practitioner.name} onClose={() => setIsChatOpen(false)} />
        )}
      </CardContent>
    </Card>
  );
};
