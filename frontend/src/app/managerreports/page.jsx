



import Sidebar from '@/components/Sidebar';
import ManagerReportDashboard from "@/components/ManagerReportDashboard/ManagerReportDashboard";
export default function ContractPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        <div className="md:p-8 p-4 pt-20 md:pt-8">
          <ManagerReportDashboard />
        </div>
      </div>
    </div>
  );
}
