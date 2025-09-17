'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { CaseModal } from '@/components/shared/CaseModal';
import { DeleteConfirmationModal } from '@/components/shared/DeleteConfirmationModal';
import { Case } from '@/types';

export default function CasesPage() {
  const { cases, users, currentUser, createCase, updateCase, deleteCase } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  const [deleteCaseId, setDeleteCaseId] = useState<string | null>(null);

  const handleSubmit = (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCase) {
      updateCase(editingCase, caseData);
    } else {
      createCase(caseData);
    }
    setShowForm(false);
    setEditingCase(null);
  };

  const handleEdit = (caseId: string) => {
    setEditingCase(caseId);
    setShowForm(true);
  };

  const handleDelete = (caseId: string) => {
    setDeleteCaseId(caseId);
  };

  const confirmDelete = () => {
    if (deleteCaseId) {
      deleteCase(deleteCaseId);
      setDeleteCaseId(null);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Case Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {showForm && (
        <CaseModal 
          caseData={editingCase ? cases.find(c => c.id === editingCase) : undefined} 
          onClose={() => {
            setShowForm(false);
            setEditingCase(null);
          }} 
          onSave={handleSubmit} 
        />
      )}

      {deleteCaseId && (
        <DeleteConfirmationModal 
          itemName="Case" 
          onClose={() => setDeleteCaseId(null)} 
          onConfirm={confirmDelete} 
        />
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length > 0 ? (
              cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.caseNumber}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell>{getUserName(c.clientId)}</TableCell>
                  <TableCell>{getUserName(c.staffId)}</TableCell>
                  <TableCell>{format(new Date(c.updatedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(c.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {currentUser?.role === 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
