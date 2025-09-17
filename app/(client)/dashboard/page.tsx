'use client';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function ClientDashboard() {
  const { cases, currentUser, findUserById } = useData();
  const myCases = cases.filter(c => c.clientId === currentUser?.id);

  const getStaffName = (staffId: string) => {
    const staff = findUserById(staffId);
    return staff ? staff.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {currentUser?.name}</h2>

      <Card>
        <CardHeader>
          <CardTitle>My Cases</CardTitle>
          <CardDescription>View the status of your legal cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCases.length > 0 ? (
                  myCases.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.caseNumber}</TableCell>
                      <TableCell>{c.title}</TableCell>
                      <TableCell>{c.status}</TableCell>
                      <TableCell>{getStaffName(c.staffId)}</TableCell>
                      <TableCell>{format(new Date(c.updatedAt), 'MMM d, yyyy')}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
