import React from 'react';

const Heatmap = ({ data }) => {
  // Helper function to get color based on contribution count
  const getColor = (count) => {
    if (count === null) return 'bg-gray-50'; // For non-available future dates
    if (count === 0) return 'bg-gray-100';
    if (count <= 3) return 'bg-sky-100';
    if (count <= 6) return 'bg-sky-300';
    if (count <= 9) return 'bg-sky-500';
    return 'bg-sky-600';
  };

  // Generate days of the week
  const weekDays = ['Mon', 'Wed', 'Fri'];

  // Generate months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

  // Generate dummy data for demonstration
  const generateDummyData = () => {
    const result = [];
    const totalWeeks = 53;
    const currentWeek = 40; // Adjust this number to control where grey boxes start

    for (let i = 0; i < totalWeeks; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i < currentWeek) {
          week.push(Math.floor(Math.random() * 12));
        } else {
          week.push(null); // Future dates will be grey
        }
      }
      result.push(week);
    }
    return result;
  };

  const contributionData = data || generateDummyData();

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-600">48 weeks worked in the last year</h3>
        <button className="text-sm text-gray-600 hover:text-gray-800">
          Contribution settings
        </button>
      </div>

      <div className="flex">
        {/* Days of the week */}
        <div className="flex flex-col justify-between mr-2 text-xs text-gray-600 py-2">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* Contribution grid */}
        <div className="flex-grow">
          <div className="flex mb-2 text-xs text-gray-600">
            {months.map((month) => (
              <span key={month} className="flex-1">{month}</span>
            ))}
          </div>
          
          <div className="flex gap-1">
            {contributionData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex-1 flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`aspect-square ${getColor(day)}`}
                    title={day !== null ? `${day} contributions` : 'No contributions'}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mt-2 text-xs text-gray-600 gap-2">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100" />
          <div className="w-3 h-3 bg-sky-100" />
          <div className="w-3 h-3 bg-sky-300" />
          <div className="w-3 h-3 bg-sky-500" />
          <div className="w-3 h-3 bg-sky-600" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
