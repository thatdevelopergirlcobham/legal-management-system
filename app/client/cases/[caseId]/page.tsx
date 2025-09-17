'use client';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { DocumentList } from '@/components/documents/DocumentList';
import { MessageSquare } from 'lucide-react';

export default function CaseDetailPage({ params }: { params: { caseId: string } }) {
  const { cases, findUserById } = useData();
  const router = useRouter();
  const caseData = cases.find(c => c.id === params.caseId);

  if (!caseData) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Case Not Found</h2>
        <p className="text-muted-foreground">The requested case could not be found.</p>
        <Button onClick={() => router.push('/client/cases')}>Back to Cases</Button>
      </div>
    );
  }

  const staffName = findUserById(caseData.staffId)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Case Details</h2>
      <Card>
        <CardHeader>
          <CardTitle>{caseData.title}</CardTitle>
          <CardDescription>Case Number: {caseData.caseNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p><strong>Status:</strong> {caseData.status}</p>
            <p><strong>Description:</strong> {caseData.description}</p>
            <p><strong>Assigned Staff:</strong> {staffName}</p>
            <p><strong>Last Updated:</strong> {format(new Date(caseData.updatedAt), 'MMM d, yyyy')}</p>
          </div>
          <div className="mt-6 flex space-x-2">
            <Button onClick={() => router.push('/client/practitioners')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Your Lawyer
            </Button>
            <Button variant="outline" onClick={() => router.push('/client/cases')}>Back to Cases</Button>
          </div>
        </CardContent>
      </Card>
      <DocumentUploader caseId={caseData.id} />
      <DocumentList caseId={caseData.id} />
    </div>
  );
};
