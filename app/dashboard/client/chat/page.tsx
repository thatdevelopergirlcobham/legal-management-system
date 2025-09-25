'use client';
import { useData } from '@/context/DataContext';
import { useSession } from 'next-auth/react';
import { ChatSession } from '@/components/chat/ChatSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function ClientChatPage() {
  const { data: session } = useSession();
  const { cases, currentUser, findUserById } = useData();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  // Get all staff assigned to client's cases
  const assignedStaff = Array.from(
    new Set(
      cases
        .filter(c => c.clientId === currentUser?.id)
        .map(c => c.staffId)
    )
  ).map(staffId => findUserById(staffId)).filter(Boolean);

  if (!assignedStaff.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No assigned lawyers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have any lawyers assigned to your cases yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Your Lawyers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignedStaff.map(staff => (
              <div 
                key={staff.id}
                className={`p-3 rounded-lg cursor-pointer ${selectedStaffId === staff.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setSelectedStaffId(staff.id)}
              >
                {staff.name}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-3">
        {selectedStaffId ? (
          <div className="h-[600px]">
            <ChatSession otherUserId={selectedStaffId} />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Select a lawyer to chat</CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
