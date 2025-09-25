'use client';
import { useData } from '@/context/DataContext';
import { PractitionerCard } from '@/components/practitioners/PractitionerCard';

export default function PractitionersPage() {
  const { users } = useData();
  const practitioners = users.filter(u => u.role === 'ADMIN' || u.role === 'STAFF');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Practitioners</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {practitioners.map(practitioner => (
          <PractitionerCard key={practitioner._id} practitioner={practitioner} />
        ))}
      </div>
    </div>
  );
};
