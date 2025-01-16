import React, { useState, useEffect } from 'react';
import { BsFillBellFill } from 'react-icons/bs';
import axios from 'axios';

const ManagerReports = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://slsvacation.com/api/manager/dashboard', {
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
          window.location.href = '/';
        }
      }
    };

    fetchDashboardData();
  }, []);

  const handleReminder = async (employee, weekInfo) => {
    try {
      // Extract just the week number from the date string without adding "WW"
      const weekNumber = weekInfo.date.split(' ')[0]; // This will give us just the number

      await axios.post('https://slsvacation.com/api/reminder/send-reminder', {
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
      <h1 className="text-center mb-2">Missing Utilization Reports</h1>
      <p className="text-gray-600 mb-6 text-center">Showing reports for the last 4 work weeks</p>
      
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Missing Reports</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr key={index} className={employee.status === '1 Missing' ? 'bg-red-50' : 'bg-white'}>
                <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {employee.reports.map((report, reportIndex) => (
                      <div key={reportIndex} className="flex items-center gap-2 border border-red-300 rounded p-0.5">
                        <span className="bg-pink-50 text-red-600 text-xs px-2 py-0.5 rounded whitespace-nowrap">
                          {report.date}
                        </span>
                        <button 
                          onClick={() => handleReminder(employee, report)}
                          className="flex items-center gap-1 text-white text-xs bg-blue-500 hover:bg-blue-600 px-2 py-0.5 rounded"
                        >
                          <BsFillBellFill className="text-white text-xs" />
                          Remind
                        </button>
                      </div>
                    ))}
                    {employee.status === 'Up to Date' && (
                      <span className="text-sm text-gray-500">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {employee.status === '1 Missing' ? (
                    <span className="inline-flex px-2 py-0.5 text-sm border border-red-300 text-red-600 bg-red-50 rounded">
                      {employee.status}
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 text-sm border border-green-300 text-green-600 bg-green-50 rounded">
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
  );
};

export default ManagerReports;
