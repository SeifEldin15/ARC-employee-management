'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ActivityRects from '@/components/Dashboard Main/ActivityRects';
import Distribution from '@/components/Dashboard Main/Distribution';
import VerticalDistribution from '@/components/Dashboard Main/VericalDistribution';
import Dashboard from '@/components/Dashboard Main/Dashboard';
import LoadingScreen from '@/components/LoadingScreen';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time - remove this in production
    // and replace with your actual data loading logic
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
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <ActivityRects 
                value="92%" 
                subLabel="+2%" 
                label="CURRENT UTILIZATION"
                color="#4CAF50"
              />
              <ActivityRects 
                value="4" 
                subLabel="Projects" 
                label="ACTIVE PROJECTS"
                color="#2196F3"
              />
              <ActivityRects 
                value="2"
                label="Missing Reports"
                subLabel="Reports"
                color="#FF5252"
              />
              <ActivityRects 
                value="85%"
                label="Target Utilization"
                subLabel="Monthly"
                color="#2196F3"
              />
            </main>
            <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 p-2 mt-4">
              <div className="w-full lg:w-1/2">
                <VerticalDistribution />
              </div>
              <div className="w-full lg:w-1/2">
                <Distribution />
              </div>
            </div>
            <Dashboard />
          </div>
        )}
      </div>
    </div>
  );
}
