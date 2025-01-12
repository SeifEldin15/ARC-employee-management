import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  const formatDateRange = (dateRange) => {
    if (!dateRange) return '';
    
    const [startDate, endDate] = dateRange.split(' - ').map(date => new Date(date));
    
    return `${startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://slsvacation.com/api/employee/reports', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        setReports(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 401) {
          // Handle unauthorized access - redirect to login
          window.location.href = '/login';
        }
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="w-full p-4">Loading...</div>;
  if (error) return <div className="w-full p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full p-4 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Work Week Reports</h1>
      
      <div className="mx-[-1rem] px-4 sm:mx-0 sm:px-0">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Work Week</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Range</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">CSR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentReports.map((report) => (
                <tr key={report.weekNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="text-sm">
                      WW{report.weekNumber}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {formatDateRange(report.dateRange)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <button 
                      className={`w-full sm:w-auto ${
                        report.utilizationReport === 'Not submitted' 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-green-100 hover:bg-green-200 text-green-800'
                      } px-3 py-1 rounded text-sm`}
                      disabled={report.utilizationReport === 'Not submitted'}
                    >
                      {report.utilizationReport === 'Not submitted' ? 'Not Available' : 'Download Utilization'}
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <button 
                      className={`w-full sm:w-auto ${
                        report.csrReport === 'Not submitted'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } px-3 py-1 rounded text-sm`}
                      disabled={report.csrReport === 'Not submitted'}
                    >
                      {report.csrReport === 'Not submitted' ? 'Not Available' : 'Download CSR'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-2 text-sm">
        <span className="text-gray-700 order-2 sm:order-1">
          Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, reports.length)} of {reports.length}
        </span>
        <div className="flex gap-1 order-1 sm:order-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 py-1 rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
