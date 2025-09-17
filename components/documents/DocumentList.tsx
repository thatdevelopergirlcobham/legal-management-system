'use client';
import { useData } from '@/context/DataContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export const DocumentList = ({ caseId }: { caseId: string }) => {
  const { documents } = useData();
  const caseDocuments = documents.filter(doc => doc.caseId === caseId);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documents</h3>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Uploaded At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caseDocuments.length > 0 ? (
              caseDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{format(new Date(doc.uploadedAt), 'MMM d, yyyy HH:mm')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No documents uploaded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
