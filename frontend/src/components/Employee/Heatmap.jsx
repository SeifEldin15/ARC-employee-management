'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VerticalDistribution = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard/employee/data');
        setReportData(response.data.reportSummary);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };
    fetchData();
  }, []);

  // Helper function to determine cell color based on reports submitted
  const getCellColor = (reportsSubmitted) => {
    if (reportsSubmitted === 0) return 'bg-gray-100';
    if (reportsSubmitted <= 2) return 'bg-green-100';
    if (reportsSubmitted <= 5) return 'bg-green-300';
    return 'bg-green-500';
  };

  // Generate weeks array for the year
  const generateWeeksArray = () => {
    const weeks = [];
    for (let i = 1; i <= 52; i++) {
      const existingData = reportData.find(data => data.week === i);
      weeks.push({
        week: i,
        reportsSubmitted: existingData ? existingData.reportsSubmitted : 0
      });
    }
    return weeks;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Reports Contribution History</h2>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-52 gap-1">
          {generateWeeksArray().map((weekData, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-sm ${getCellColor(weekData.reportsSubmitted)} hover:ring-2 hover:ring-gray-400`}
              title={`Week ${weekData.week}: ${weekData.reportsSubmitted} reports`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded-sm" />
            <div className="w-4 h-4 bg-green-100 rounded-sm" />
            <div className="w-4 h-4 bg-green-300 rounded-sm" />
            <div className="w-4 h-4 bg-green-500 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalDistribution;
