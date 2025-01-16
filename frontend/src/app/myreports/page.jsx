'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import axios from 'axios'

export default function MyReports() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://slsvacation.com/api/employee/reports', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        // Transform API data to match our component's structure
        const formattedReports = response.data.map(report => ({
          id: `week-${report.weekNumber}-${report.dateRange}`,
          title: `Work Week ${report.weekNumber}`,
          dateRange: report.dateRange,
          hasCSV: Boolean(report.csrReport),
          hasUtilization: Boolean(report.utilizationReport)
        }))
        
        setReports(formattedReports)
      } catch (error) {
        console.error('Error fetching reports:', error)
        if (error.response?.status === 401) {
          console.log('Unauthorized access - redirecting to login');
        }
      }
    }

    fetchReports()
  }, [])

  return (
    <>
      <Sidebar />
      <div className="md:ml-64 pt-20 md:pt-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className=" mb-6 text-center">My Reports</h1>
          
          <div className="space-y-4">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div>
                  <h2 className="font-semibold">{report.title}</h2>
                  <p className="text-sm text-gray-600">{report.dateRange}</p>
                </div>
                
                <div className="flex gap-2">
                  {report.hasCSV && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                      Download CSV
                    </button>
                  )}
                  {report.hasUtilization && (
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm">
                      Download Utilization
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
