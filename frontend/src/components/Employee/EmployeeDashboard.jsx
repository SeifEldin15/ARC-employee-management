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
          `http://localhost:5000/api/manager/team/${employeeId}`,
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Missing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div className="text-sm text-gray-600 col-span-2">Status</div>
          <div className="text-sm text-gray-600 col-span-1">Actions</div>
        </div>

        {workWeeks.map((week, index) => (
          <div 
            key={week.week} 
            className={`min-w-[768px] grid grid-cols-12 p-4 border-b last:border-b-0 items-center ${
              week.status === 'Missing' ? 'bg-red-50' : ''
            }`}
          >
            <div className="col-span-2 text-sm text-gray-900">{week.week}</div>
            <div className="col-span-2 text-sm text-gray-900">{week.dateRange}</div>
            <div className="col-span-2">
              <div className="relative flex-1 bg-gray-200 rounded-full h-5 overflow-hidden mr-6">
                <div
                  className="absolute top-0 left-0 bg-blue-500 h-full rounded-full transition-all duration-300 flex items-center justify-center"
                  style={{ width: `${week.utilization}%` }}
                >
                  <span className="text-xs text-white font-medium px-1">
                    {week.utilization}%
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-3 text-sm text-gray-900 pl-12">{week.billableHours}</div>
            <div className="col-span-2">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(week.status)}`}>
                {week.status}
              </span>
            </div>
            <div className="col-span-1">
              <div className="flex space-x-2">
                <button 
                  className="p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => handleViewPdf(week.pdfPath)}
                  disabled={!week.pdfPath}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button 
                  className="p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => handleDownloadCsr(week.csrPath)}
                  disabled={!week.csrPath}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
