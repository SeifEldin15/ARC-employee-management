import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employee/reports', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
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
              {reports.map((report) => (
                <tr key={report.weekNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="text-sm">
                      WW{report.weekNumber}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {report.dateRange}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      {report.utilizationReport ? 'Download' : 'Submit'} Utilization
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      {report.csrReport ? 'Download' : 'Submit'} CSR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-2 text-sm">
        <span className="text-gray-700 order-2 sm:order-1">Showing 1-7 of 42</span>
        <div className="flex gap-1 order-1 sm:order-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-2 py-1 rounded ${
                page === 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
