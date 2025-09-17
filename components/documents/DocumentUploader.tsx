'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const DocumentUploader = ({ caseId }: { caseId: string }) => {
  const [fileName, setFileName] = useState('');
  const { uploadDocument } = useData();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim()) {
      uploadDocument(caseId, fileName);
      setFileName('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Document</h3>
      <form onSubmit={handleUpload} className="flex space-x-2">
        <input
          type="text"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          placeholder="Enter document name"
          className="flex-1 p-2 border rounded-md text-slate-200 bg-secondary"
          required
        />
        <Button type="submit">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </form>
    </div>
  );
};
