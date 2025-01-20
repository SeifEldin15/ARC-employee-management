'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ManagerReports from '@/components/Manager Dashboard/ManagerReports';
import Distribution from '@/components/Dashboard Main/Distribution';
import VerticalDistribution from '@/components/Dashboard Main/VericalDistribution';
import LoadingScreen from '@/components/LoadingScreen';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="md:p-8 p-4 pt-20 md:pt-8">
            <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 p-2 mb-4">
              <div className="w-full lg:w-1/2">
                <VerticalDistribution />
              </div>
              <div className="w-full lg:w-1/2">
                <Distribution />
              </div>
            </div>
            <ManagerReports />
          </div>
        )}
      </div>
    </div>
  );
}
