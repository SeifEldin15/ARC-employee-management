import React, { useState, useEffect } from 'react';
import { BsFillBellFill } from 'react-icons/bs';
import axios from 'axios';

const ManagerReports = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard/manager', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        // Transform API data to match component structure
        const transformedData = response.data.map(item => ({
          name: item.employee.name,
          email: item.employee.email,
          reports: item.missingWeeks.map(week => ({
            date: `${week.weekNumber} (${week.dateRange})`,
            missing: true
          })),
          status: item.missingWeeks.length > 0 ? `${item.missingWeeks.length} Missing` : 'Up to Date'
        }));

        setEmployees(transformedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle unauthorized access
        if (error.response?.status === 401) {
          // Redirect to login page
        }
      }
    };

    fetchDashboardData();
  }, []);

  const handleReminder = async (employee, weekInfo) => {
    try {
      // Extract just the week number from the date string without adding "WW"
      const weekNumber = weekInfo.date.split(' ')[0]; // This will give us just the number

      await axios.post('http://localhost:5000/api/reminder/send-reminder', {
        email: employee.email,
        missingWeekS: weekNumber  // Send just the number, let backend add "WW"
      }, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      // Optionally add success notification here
    } catch (error) {
      console.error('Error sending reminder:', error);
      // Optionally add error notification here
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Missing Utilization Reports</h1>
        <p className="text-gray-600 mb-8">Showing reports for the last 4 work weeks</p>
        
        <div className="overflow-hidden shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Employee Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Missing Reports</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {employee.reports.map((report, reportIndex) => (
                        <div key={reportIndex} 
                             className="flex w-[48%] items-center justify-between gap-2 border border-red-200 rounded-lg bg-red-50/50 p-2 hover:bg-red-50 transition-colors">
                          <span className="text-red-600 text-xs font-medium">
                            Week {report.date}
                          </span>
                          <button 
                            onClick={() => handleReminder(employee, report)}
                            className="flex items-center gap-1.5 text-white text-xs font-medium bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                          >
                            <BsFillBellFill className="text-xs" />
                            Remind
                          </button>
                        </div>
                      ))}
                      {employee.status === 'Up to Date' && (
                        <span className="text-sm text-gray-500 italic">All reports submitted</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {employee.status === 'Up to Date' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {employee.status}
                      </span>
                    ) : (
                      <span className="inline-flex px-4 py-1 text-sm border border-red-300 text-red-600 bg-red-50 rounded min-w-[100px] justify-center">
                        {employee.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
