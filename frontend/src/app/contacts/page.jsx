'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ContactsDashboard from '@/components/Contacts/ContactsDashboard';
import LoadingScreen from '@/components/LoadingScreen';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="md:p-8 p-4 pt-20 md:pt-8">
            <ContactsDashboard />
          </div>
        )}
      </div>
    </div>
  );
}
