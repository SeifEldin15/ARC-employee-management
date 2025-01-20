'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ManagerReportDashboard from "@/components/ManagerReportDashboard/ManagerReportDashboard";
import LoadingScreen from '@/components/LoadingScreen';

export default function ContractPage() {
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
            <ManagerReportDashboard />
          </div>
        )}
      </div>
    </div>
  );
}
