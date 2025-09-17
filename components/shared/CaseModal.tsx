'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Case } from '@/types';
import { useData } from '@/context/DataContext';

export const CaseModal = ({ caseData, onClose, onSave }: { caseData?: Case; onClose: () => void; onSave: (data: Omit<Case, 'id' | 'createdAt' | 'updatedAt'> | Case) => void }) => {
  const { currentUser, users } = useData();
  const [formData, setFormData] = React.useState({
    caseNumber: caseData?.caseNumber || '',
    title: caseData?.title || '',
    description: caseData?.description || '',
    status: caseData?.status || 'Open',
    clientId: caseData?.clientId || '',
    staffId: caseData?.staffId || (currentUser?.role === 'STAFF' ? currentUser?.id : ''),
  });

  const clients = users.filter(u => u.role === 'CLIENT');
  const staff = users.filter(u => u.role === 'STAFF' || u.role === 'ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4 text-slate-200">{caseData ? 'Edit Case' : 'Create New Case'}</h3>
        <div className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Case Number</label>
              <input
                type="text"
                value={formData.caseNumber}
                onChange={e => setFormData({ ...formData, caseNumber: e.target.value })}
                className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'Open' | 'In Progress' | 'Closed' })}
                className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Client</label>
              <select
                value={formData.clientId}
                onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-200">Assigned Staff</label>
              {currentUser?.role === 'ADMIN' ? (
                <select
                  value={formData.staffId}
                  onChange={e => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
                  required
                >
                  <option value="">Select Staff</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={staff.find(s => s.id === formData.staffId)?.name || 'Unknown'}
                  className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
                  disabled
                />
              )}
            </div>
            <div className="flex space-x-2 pt-4">
              <Button type="submit">{caseData ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
