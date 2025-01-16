'use client';
import Sidebar from '@/components/Sidebar';
import ActivityRects from '@/components/Dashboard Main/ActivityRects';

export default function EmployeeDashboard() {
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
        </div>
      </div>
    </div>
  );
}