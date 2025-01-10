'use client';
import Sidebar from '@/components/Sidebar';
import ActivityRects from '@/components/Dashboard Main/ActivityRects';
import Distribution from '@/components/Dashboard Main/Distribution';
import VerticalDistribution from '@/components/Dashboard Main/VericalDistribution';
import Dashboard from '@/components/Dashboard Main/Dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
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
      </div>
    </div>
  );
}
