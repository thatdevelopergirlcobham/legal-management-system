'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Appointments</h2>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Manage your scheduled meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
        </CardContent>
      </Card>
    </div>
  );
};
