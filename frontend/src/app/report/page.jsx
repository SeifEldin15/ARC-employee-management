'use client'
import { useState, useEffect } from 'react'
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

  // Get week number from URL
  const [weekNumber, setWeekNumber] = useState('')
  
  // Update state variables - remove weekStart/weekEnd
  const [srvInputs, setSrvInputs] = useState({}) // Changed to handle multiple SVRs per day
  const [hourInputs, setHourInputs] = useState({})

  // Add useEffect to get week number from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setWeekNumber(params.get('week') || '')
    }
  }, [])

  const handleSubmit = async () => {
    // Format SVR data
    const svrCategory = days.map(day => ({
      SVR: srvInputs[day] || '',
      day: day.toLowerCase()
    })).filter(item => item.SVR !== '')

    // Format tasks data - modified to correctly capture activities and hours
    const tasks = Object.entries(hourInputs)
      .map(([key, hours]) => {
        if (!hours || hours === '0.0') return null;
        
        const [day, activity] = key.split('-');
        return {
          category: activities[parseInt(activity)].toLowerCase(), // Convert activity index to actual activity name
          hours: Number(hours),
          day: day
        };
      })
      .filter(task => task !== null);

    const formattedData = {
      WeekNumber: parseInt(weekNumber), // Ensure week number is sent as integer
      year: new Date().getFullYear(),
      SVR_Category: svrCategory,
      tasks: tasks
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch('/api/reports/utilization', {
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
        const errorData = await response.json();
        alert(`Failed to submit report: ${errorData.message || 'Unknown error'}`)
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
                <label className="text-sm text-gray-600">Week Number</label>
                <input 
                  type="text" 
                  value={weekNumber}
                  readOnly
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-gray-50" 
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
                        value={srvInputs[weekNumber] || ''}
                        onChange={(e) => setSrvInputs(prev => ({
                          ...prev, 
                          [weekNumber]: e.target.value
                        }))}
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
                      <td className="py-2 px-4">
                        <input 
                          type="text" 
                          value={srvInputs[day] || ''}
                          onChange={(e) => setSrvInputs(prev => ({
                            ...prev, 
                            [day]: e.target.value
                          }))}
                          placeholder="Enter SRV#"
                          className="w-full text-sm px-2 py-1 border border-gray-200 rounded bg-white"
                        />
                      </td>
                      {[...Array(numberOfColumns)].map((_, index) => (
                        <td key={index} className="py-2 px-4">
                          <input 
                            type="number" 
                            value={hourInputs[`${day}-${index}`] || '0.0'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 24)) {
                                setHourInputs(prev => ({
                                  ...prev, 
                                  [`${day}-${index}`]: value
                                }))
                              }
                            }}
                            min="0"
                            max="24"
                            step="0.5"
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
