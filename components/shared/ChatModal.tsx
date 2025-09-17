'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const ChatModal = ({ recipientName, onClose }: { recipientName: string; onClose: () => void }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sending message
    setMessage('');
    alert(`Message sent to ${recipientName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-slate-200">Chat with {recipientName}</h3>
        <form onSubmit={handleSend} className="space-y-4">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-2 border rounded-md text-slate-200 bg-secondary"
            rows={4}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
