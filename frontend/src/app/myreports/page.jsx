'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function MyReports() {
  const reports = [
    {
      id: 49,
      title: 'Work Week 49',
      dateRange: '11/27/2024 - 12/3/2024',
      hasCSV: true,
      hasUtilization: true,
    },
    {
      id: 48,
      title: 'Work Week 48',
      dateRange: '11/20/2024 - 11/26/2024',
      hasCSV: true,
      hasUtilization: true,
    },
    // ... add more reports as needed
  ]

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
