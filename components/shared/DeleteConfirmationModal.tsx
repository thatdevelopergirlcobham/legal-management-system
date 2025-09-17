'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export const DeleteConfirmationModal = ({ itemName, onClose, onConfirm }: { itemName: string; onClose: () => void; onConfirm: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-slate-200">Delete {itemName}?</h3>
        <p className="text-muted-foreground mb-6 text-slate-200">Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
};
