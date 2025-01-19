import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [workWeeks, setWorkWeeks] = useState([]);
  
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Get employeeId from URL path directly
        const employeeId = window.location.pathname.split('/').pop();
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found in localStorage');
          return;
        }

        const response = await axios.get(
          `/api/team/details/${employeeId}`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          const transformedData = response.data.data.utilizationHistory.map(week => {
            // Format the date range
            const startDate = new Date(week.dateRange.split(' - ')[0]);
            const endDate = new Date(week.dateRange.split(' - ')[1]);
            
            const formatDate = (date) => {
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            };

            const formattedDateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

            return {
              week: `WW${week.week}`,
              dateRange: formattedDateRange,
              utilization: Math.round((week.sumWorkHours / 40) * 100),
              billableHours: `${week.sumWorkHours}/40hrs`,
              status: week.utilizationPdfPath ? 'Submitted' : 'Missing',
              pdfPath: week.utilizationPdfPath,
              csrPath: week.csrPdfPath
            };
          });
          setWorkWeeks(transformedData);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Unauthorized access - redirecting to login');
          window.location.href = '/';
          return;
        }
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  // Update the button click handlers
  const handleViewPdf = (pdfPath) => {
    if (pdfPath) {
      window.open(pdfPath, '_blank');
    }
  };

  const handleDownloadCsr = (csrPath) => {
    if (csrPath) {
      window.open(csrPath, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6">Work Weeks History</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="min-w-[768px] grid grid-cols-12 p-4 border-b bg-gray-50">
          <div className="text-sm text-gray-600 col-span-2">Week</div>
          <div className="text-sm text-gray-600 col-span-2">Date Range</div>
          <div className="text-sm text-gray-600 col-span-2">Utilization</div>
          <div className="text-sm text-gray-600 col-span-3 pl-12">Billable Hours</div>
          <div className="text-sm text-gray-600 col-span-3">Documents</div>
        </div>

        {workWeeks.map((week, index) => (
          <div 
            key={week.week} 
            className="min-w-[768px] grid grid-cols-12 p-4 border-b last:border-b-0 items-center"
          >
            <div className="col-span-2 text-sm text-gray-900">{week.week}</div>
            <div className="col-span-2 text-sm text-gray-900">{week.dateRange}</div>
            <div className="col-span-2">
              <div className="relative flex-1 bg-gray-200 rounded-full h-5 overflow-hidden mr-6">
                <div
                  className="absolute top-0 left-0 bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${week.utilization}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-black font-medium px-1">
                    {week.utilization}%
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-3 text-sm text-gray-900 pl-12">{week.billableHours}</div>
            <div className="col-span-3">
              <div className="flex space-x-2">
                {week.pdfPath ? (
                  <button 
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md hover:bg-blue-50"
                    onClick={() => handleViewPdf(week.pdfPath)}
                  >
                    Download Utilization
                  </button>
                ) : (
                  <span className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md bg-red-50">
                    Missing Utilization
                  </span>
                )}
                
                {week.csrPath ? (
                  <button 
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md hover:bg-blue-50"
                    onClick={() => handleDownloadCsr(week.csrPath)}
                  >
                    Download CSR
                  </button>
                ) : (
                  <span className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md bg-red-50">
                    Missing CSR
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
