'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

const Report = () => {
  // Define number of columns we want
  const numberOfColumns = 4;
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const activities = [
    'Travel',
    'Paid Service',
    'Contract',
    'Warranty',
    'Install',
    'Mfg Support',
    'Goodwill Customer Visits',
    'Training',
    'Received/Given',
    'Admin',
    'Tech Support',
    'CFT Project',
    'Idle Time/PTO',
    'Holiday',
    'Select Activity'
  ]

  const [weekStart, setWeekStart] = useState('')
  const [weekEnd, setWeekEnd] = useState('')
  const [srvInput, setSrvInput] = useState('')
  const [hourInputs, setHourInputs] = useState({})

  const handleSubmit = async () => {
    const formattedData = {
      workWeek: weekStart,
      year: new Date(weekStart).getFullYear().toString(),
      SVR: srvInput,
      tasks: days.flatMap(day =>
        activities.slice(0, -1).map(activity => ({
          category: activity.toLowerCase(),
          hours: hourInputs[`${day}-${activity}`] || '',
          day: day
        }))
      )
    }

    try {
      // Get token only when needed and check if we're in browser environment
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch('https://slsvacation.com/api/employee/utilization', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formattedData)
      })
      
      if (response.ok) {
        alert('Report submitted successfully!')
      } else {
        alert('Failed to submit report')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Error submitting report')
    }
  }

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
                  value={weekStart}
                  onChange={(e) => setWeekStart(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-white" 
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Week Ending</label>
                <input 
                  type="date" 
                  value={weekEnd}
                  onChange={(e) => setWeekEnd(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-white" 
                />
              </div>
            </div>

            {/* Report Table */}
            <div className="bg-[#F8F9FA] rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-sm font-normal text-gray-600 text-left">Day</th>
                    <th className="py-3 px-4 text-sm font-normal text-gray-600 text-left">
                      <input 
                        type="text" 
                        value={srvInput}
                        onChange={(e) => setSrvInput(e.target.value)}
                        placeholder="Enter SRV#" 
                        className="w-full text-sm px-2 py-1 border border-gray-200 rounded bg-white"
                      />
                    </th>
                    {[...Array(numberOfColumns)].map((_, index) => (
                      <th key={index} className="py-3 px-4 text-sm font-normal text-gray-600 text-left">
                        <select className="w-full bg-transparent outline-none">
                          <option value="">Select Activity</option>
                          {activities.slice(0, -1).map(activity => (
                            <option key={activity} value={activity}>{activity}</option>
                          ))}
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
                      <td className="py-2 px-4 text-sm text-gray-600">{srvInput}</td>
                      {[...Array(numberOfColumns)].map((_, index) => (
                        <td key={index} className="py-2 px-4">
                          <input 
                            type="number" 
                            value={hourInputs[`${day}-${index}`] || '0.0'}
                            onChange={(e) => setHourInputs(prev => ({
                              ...prev, 
                              [`${day}-${index}`]: e.target.value
                            }))}
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
              <button 
                onClick={handleSubmit}
                className="bg-green-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-600"
              >
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
