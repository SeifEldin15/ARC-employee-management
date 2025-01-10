'use client';
import Sidebar from '@/components/Sidebar';
import ContactsDashboard from '@/components/Contacts/ContactsDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        <div className="md:p-8 p-4 pt-20 md:pt-8">
          <ContactsDashboard />
        </div>
      </div>
    </div>
  );
}
