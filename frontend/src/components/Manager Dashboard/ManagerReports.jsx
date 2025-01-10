import React from 'react';
import { BsFillBellFill } from 'react-icons/bs';

const ManagerReports = () => {
  const employees = [
    {
      name: 'Emily Team',
      reports: [
        { date: 'WK47 (Nov 17 - Nov 23)', missing: true },
        { date: 'WK48 (Nov 24 - Nov 30)', missing: true },
        { date: 'WK49 (Dec 1 - Dec 7)', missing: true },
      ],
      status: '1 Missing'
    },
    {
      name: 'Nancy Wright',
      reports: [
        { date: 'WK47 (Nov 17 - Nov 23)', missing: true },
        { date: 'WK48 (Nov 24 - Nov 30)', missing: true },
        { date: 'WK49 (Dec 1 - Dec 7)', missing: true },
      ],
      status: '1 Missing'
    },
    // Add more employees with "Up to Date" status
    {
      name: 'Christopher King',
      reports: [],
      status: 'Up to Date'
    },
  ];

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
                        <button className="flex items-center gap-1 text-white text-xs bg-blue-500 hover:bg-blue-600 px-2 py-0.5 rounded">
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
