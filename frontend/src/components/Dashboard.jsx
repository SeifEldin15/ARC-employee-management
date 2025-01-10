import React from 'react';

const Dashboard = () => {
  const workWeeks = [
    { id: 'WW49', date: 'Dec 1 - Dec 8, 2024', status: 'current' },
    { id: 'WW48', date: 'Nov 25 - Nov 29, 2024', status: 'completed' },
    { id: 'WW47', date: 'Nov 18 - Nov 22, 2024', status: 'completed' },
    { id: 'WW46', date: 'Nov 11 - Nov 15, 2024', status: 'completed' },
    { id: 'WW45', date: 'Nov 4 - Nov 8, 2024', status: 'completed' },
    { id: 'WW44', date: 'Oct 28 - Nov 1, 2024', status: 'completed' },
    { id: 'WW43', date: 'Oct 21 - Oct 25, 2024', status: 'completed' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Work Week Reports</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg border rounded-lg">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Work Week</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Range</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Utilization</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">CSR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workWeeks.map((week) => (
              <tr key={week.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm">
                    {week.id} {week.status === 'current' && 
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">Current</span>
                    }
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{week.date}</td>
                <td className="px-4 py-2 whitespace-nowrap text-right">
                  <button className={`px-3 py-1 rounded text-sm ${
                    week.status === 'current'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}>
                    {week.status === 'current' ? 'Submit' : 'Download'} Utilization
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    {week.status === 'current' ? 'Submit' : 'Download'} CSR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-sm">
        <span className="text-gray-700">Showing 1-7 of 42</span>
        <div className="flex gap-1">
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
