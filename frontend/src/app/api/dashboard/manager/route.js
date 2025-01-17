import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import User from '@/app/api/lib/models/User';
import Workweek from '@/app/api/lib/models/workweek';
import { verifyAuth } from '@/app/api/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const employees = await User.find({ 
      managerId: user._id, 
      role: 'Employee' 
    }).select("name email");

    const allWeeks = await Workweek.find()
      .select('weekNumber startDate endDate pendingReports');

    const employeeData = await Promise.all(employees.map(async (employee) => {
      const missingWeeks = allWeeks
        .filter(week => {
          const report = week.pendingReports.find(
            report => report.employeeId.toString() === employee._id.toString()
          );
          return !report;
        })
        .map(week => ({
          weekNumber: `WW${week.weekNumber}`,
          dateRange: week.startDate && week.endDate 
            ? `${week.startDate.toISOString().split('T')[0]} - ${week.endDate.toISOString().split('T')[0]}`
            : 'Date range not available'
        }));

      return {
        employee,
        missingWeeks
      };
    }));

    // Sort by number of missing weeks (descending)
    employeeData.sort((a, b) => b.missingWeeks.length - a.missingWeeks.length);

    return NextResponse.json(employeeData, { status: 200 });
  } catch (error) {
    console.error('Error in getManagerDashboard:', error);
    return NextResponse.json({ 
      message: 'Error fetching dashboard data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}