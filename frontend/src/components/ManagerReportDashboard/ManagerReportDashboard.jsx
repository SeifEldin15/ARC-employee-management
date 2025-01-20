'use client'

import { FaFileDownload } from 'react-icons/fa'
import { IoDocument } from 'react-icons/io5'

export default function ManagerReports() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl text-gray-700 mb-6">Utilization Reports</h1>

      <div className="mb-8">
        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-t-lg border border-gray-200">
          <IoDocument className="text-blue-500 text-xl" />
          <h2 className="text-gray-900 font-medium">Weekly Reports</h2>
        </div>

        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead>
              <tr>
                <td className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="sm:flex-1" />
                    <div className="text-center sm:flex-1">
                      <div className="text-sm text-gray-500">CURRENT WEEK</div>
                      <div className="text-gray-700">Week of Dec 3 - Dec 9, 2024</div>
                    </div>
                    <div className="sm:flex-1 flex justify-center sm:justify-end mt-2 sm:mt-0">
                      <button className="flex items-center gap-2 text-blue-500 text-sm hover:text-blue-600">
                        <FaFileDownload />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-gray-50 p-4 border-y border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">PREVIOUS REPORTS</div>
                    <div className="h-[1px] bg-gray-300 flex-1"></div>
                  </div>
                </td>
              </tr>
              {[
                {
                  week: 'Week of Nov 26 - Dec 2, 2024',
                  generated: 'Generated on November 25, 2024'
                },
                {
                  week: 'Week of Nov 19 - Nov 25, 2024',
                  generated: 'Generated on November 19, 2024'
                }
              ].map((report, index) => (
                <tr key={index}>
                  <td className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="sm:flex-1" />
                      <div className="text-center sm:flex-1">
                        <div className="text-gray-700">{report.week}</div>
                        <div className="text-sm text-gray-400">{report.generated}</div>
                      </div>
                      <div className="sm:flex-1 flex justify-center sm:justify-end mt-2 sm:mt-0">
                        <button className="flex items-center gap-2 text-blue-500 text-sm hover:text-blue-600">
                          <FaFileDownload />
                          Download
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Reports Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-t-lg border border-gray-200">
          <IoDocument className="text-blue-500 text-xl" />
          <h2 className="text-gray-900 font-medium">Monthly Reports</h2>
        </div>

        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead>
              <tr>
                <td className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="sm:flex-1" />
                    <div className="text-center sm:flex-1">
                      <div className="text-sm text-gray-500">CURRENT MONTH</div>
                      <div className="text-gray-700">December 2024</div>
                    </div>
                    <div className="sm:flex-1 flex justify-center sm:justify-end mt-2 sm:mt-0">
                      <button className="flex items-center gap-2 text-blue-500 text-sm hover:text-blue-600">
                        <FaFileDownload />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-gray-50 p-4 border-y border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">PREVIOUS REPORTS</div>
                    <div className="h-[1px] bg-gray-300 flex-1"></div>
                  </div>
                </td>
              </tr>
              {[
                {
                  month: 'November 2024',
                  generated: 'Generated on November 1, 2024'
                },
                {
                  month: 'October 2024',
                  generated: 'Generated on October 1, 2024'
                }
              ].map((report, index) => (
                <tr key={index}>
                  <td className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="sm:flex-1" />
                      <div className="text-center sm:flex-1">
                        <div className="text-gray-700">{report.month}</div>
                        <div className="text-sm text-gray-400">{report.generated}</div>
                      </div>
                      <div className="sm:flex-1 flex justify-center sm:justify-end mt-2 sm:mt-0">
                        <button className="flex items-center gap-2 text-blue-500 text-sm hover:text-blue-600">
                          <FaFileDownload />
                          Download
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
