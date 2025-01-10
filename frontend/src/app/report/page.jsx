'use client'
import Sidebar from '@/components/Sidebar'

const Report = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const activities = ['Training', 'Development', 'Testing', 'Select Activity']

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Sidebar />
      <div className="md:ml-64 pt-20 md:pt-0 ">
        <div className="p-8 ">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl font-normal text-gray-700 mb-8 text-center">Weekly Utilization Report</h1>
            
            {/* Date Range Inputs */}
            <div className="flex gap-12 mb-8">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Week Starting</label>
                <input 
                  type="date" 
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-white" 
                  placeholder="mm/dd/yyyy"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Week Ending</label>
                <input 
                  type="date" 
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-white" 
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>

            {/* Report Table */}
            <div className="bg-[#F8F9FA] rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-sm font-normal text-gray-600 text-left">Day</th>
                    <th className="py-3 px-4 text-sm font-normal text-gray-600 text-left">SRV#</th>
                    {activities.map((activity) => (
                      <th key={activity} className="py-3 px-4 text-sm font-normal text-gray-600 text-left">
                        <select className="w-full bg-transparent outline-none">
                          <option>{activity}</option>
                        </select>
                      </th>
                    ))}
                    <th className="py-3 px-2 w-10">
                      <button className="p-1 rounded-full bg-blue-500 text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day} className="border-b">
                      <td className="py-2 px-4 text-sm text-gray-600">{day}</td>
                      <td className="py-2 px-4">
                        <input 
                          type="text" 
                          placeholder="Enter SRV#" 
                          className="w-full text-sm px-2 py-1 border border-gray-200 rounded bg-white"
                        />
                      </td>
                      {activities.map((activity) => (
                        <td key={activity} className="py-2 px-4">
                          <input 
                            type="number" 
                            defaultValue="0.0" 
                            className="w-full text-sm px-2 py-1 border border-gray-200 rounded bg-white"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-4 text-sm text-gray-600 text-right">8.0</td>
                      <td className="py-2 px-2"></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="py-3 px-4 text-sm font-medium text-gray-600">Total Hours</td>
                    <td colSpan={activities.length + 2} className="py-3 px-4 text-sm font-medium text-gray-600 text-right">48.0</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button className="bg-green-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report
