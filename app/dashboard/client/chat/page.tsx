'use client';
import { useData } from '@/context/DataContext';
import { ChatSession } from '@/components/chat/ChatSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { IUser } from '@/lib/mockData';

export default function ClientChatPage() {
  const { cases, currentUser, findUserById } = useData();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [assignedStaff, setAssignedStaff] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load staff data when component mounts
  useEffect(() => {
    const loadStaffData = async () => {
      if (!currentUser) return;
      
      try {
        // Get unique staff IDs from client's cases
        const staffIds = Array.from(
          new Set(
            cases
              .filter(c => c.clientId === currentUser._id)
              .map(c => c.staffId)
          )
        );
        
        // Fetch staff data for each ID
        const staffData: IUser[] = [];
        for (const id of staffIds) {
          const staff = await findUserById(id);
          if (staff) staffData.push(staff);
        }
        
        setAssignedStaff(staffData);
      } catch (error) {
        console.error('Error loading staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStaffData();
  }, [cases, currentUser, findUserById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!assignedStaff.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No assigned lawyers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don&apos;t have any lawyers assigned to your cases yet.</p>
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
                key={staff._id}
                className={`p-3 rounded-lg cursor-pointer ${selectedStaffId === staff._id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setSelectedStaffId(staff._id)}
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
