'use client';
import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChatSession } from '@/components/chat/ChatSession';

export const StaffDashboard = () => {
  const { cases, currentUser, findUserById } = useData();
  const myCases = cases.filter(c => c.staffId === currentUser?._id);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [selectedClientName, setSelectedClientName] = useState<string>('Client');
  
  const selectedClientId = selectedCase 
    ? cases.find(c => c._id === selectedCase)?.clientId 
    : null;

  // Load client names when component mounts
  useEffect(() => {
    const loadClientNames = async () => {
      if (!myCases.length) return;
      
      const clientIds = Array.from(new Set(myCases.map(c => c.clientId)));
      const namesMap: Record<string, string> = {};
      
      for (const id of clientIds) {
        try {
          const client = await findUserById(id);
          namesMap[id] = client ? client.name : 'Unknown';
        } catch (error) {
          console.error(`Error fetching client ${id}:`, error);
          namesMap[id] = 'Unknown';
        }
      }
      
      setClientNames(namesMap);
    };
    
    loadClientNames();
  }, [myCases, findUserById]);

  // Update selected client name when selectedClientId changes
  useEffect(() => {
    const updateSelectedClientName = async () => {
      if (!selectedClientId) return;
      
      try {
        const client = await findUserById(selectedClientId);
        setSelectedClientName(client ? client.name : 'Client');
      } catch (error) {
        console.error('Error fetching selected client:', error);
        setSelectedClientName('Client');
      }
    };
    
    updateSelectedClientName();
  }, [selectedClientId, findUserById]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {currentUser?.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Active Cases</CardTitle>
            <CardDescription>Cases assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myCases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Client Messages</CardTitle>
            <CardDescription>New messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-${selectedCase ? '2' : '3'}`}>
          <h3 className="text-xl font-semibold">My Cases</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCases.length > 0 ? (
                  myCases.map((c) => (
                    <TableRow 
                      key={c._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedCase(c._id === selectedCase ? null : c._id)}
                    >
                      <TableCell className="font-medium">{c.caseNumber}</TableCell>
                      <TableCell>{c.title}</TableCell>
                      <TableCell>{c.status}</TableCell>
                      <TableCell>{clientNames[c.clientId] || 'Loading...'}</TableCell>
                      <TableCell>{c.updatedAt ? format(new Date(c.updatedAt), 'MMM d, yyyy') : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      You have no active cases.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {selectedCase && selectedClientId && (
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold">
              Chat with {selectedClientName}
            </h3>
            <div className="h-[600px]">
              <ChatSession otherUserId={selectedClientId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};