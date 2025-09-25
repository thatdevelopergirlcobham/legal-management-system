'use client';
import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { CaseModal } from '@/components/shared/CaseModal';
import { DeleteConfirmationModal } from '@/components/shared/DeleteConfirmationModal';
import { ICase } from '@/lib/mockData';

export default function CasesPage() {
  const { cases, users, currentUser, createCase, updateCase, deleteCase } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  const [deleteCaseId, setDeleteCaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  // Load user names when component mounts
  useEffect(() => {
    const loadUserNames = async () => {
      const namesMap: Record<string, string> = {};
      users.forEach(user => {
        namesMap[user._id] = user.name;
      });
      setUserNames(namesMap);
    };
    
    loadUserNames();
  }, [users]);

  const handleSubmit = async (caseData: Omit<ICase, '_id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      if (editingCase) {
        await updateCase(editingCase, caseData);
      } else {
        await createCase(caseData);
      }
      setShowForm(false);
      setEditingCase(null);
    } catch (error) {
      console.error('Error saving case:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (caseId: string) => {
    setEditingCase(caseId);
    setShowForm(true);
  };

  const handleDelete = (caseId: string) => {
    setDeleteCaseId(caseId);
  };

  const confirmDelete = async () => {
    if (deleteCaseId) {
      setIsLoading(true);
      try {
        await deleteCase(deleteCaseId);
        setDeleteCaseId(null);
      } catch (error) {
        console.error('Error deleting case:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getUserName = (userId: string) => {
    return userNames[userId] || 'Unknown';
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
          caseData={editingCase ? cases.find(c => c._id === editingCase) : undefined} 
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
                <TableRow key={c._id}>
                  <TableCell className="font-medium">{c.caseNumber}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell>{getUserName(c.clientId)}</TableCell>
                  <TableCell>{getUserName(c.staffId)}</TableCell>
                  <TableCell>{c.updatedAt ? format(new Date(c.updatedAt), 'MMM d, yyyy') : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(c._id)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {currentUser?.role === 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(c._id)}
                          disabled={isLoading}
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
