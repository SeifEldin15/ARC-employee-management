import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Workweek from '@/app/api/lib/models/workweek';
import User from '@/app/api/lib/models/User';
import { verifyAuth } from '@/app/api/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user from the database to get the createdAt date
    const userData = await User.findById(user._id).select('createdAt');
    if (!userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get the user's creation date
    const userCreatedDate = new Date(userData.createdAt);

    const workweeks = await Workweek.find({}).sort({ weekNumber: 1 });

    const filteredWorkweeks = workweeks.filter(week => new Date(week.startDate) >= userCreatedDate);

    const reports = filteredWorkweeks.map((week) => {
      const employeeReport = week.pendingReports.find(
        (report) => report.employeeId?.toString() === user._id.toString()
      );

      if (!employeeReport) {
        return {
          weekNumber: week.weekNumber,
          dateRange: `${new Date(week.startDate).toDateString()} - ${new Date(week.endDate).toDateString()}`,
          utilizationReport: 'Not submitted',
          csrReport: 'Not submitted',
        };
      }

      const utilizationReport = employeeReport.reportTypes.find(
        (rt) => rt.type === 'Utilization'
      );
      const csrReport = employeeReport.reportTypes.find(
        (rt) => rt.type === 'CSR'
      );

      return {
        weekNumber: week.weekNumber,
        dateRange: `${new Date(week.startDate).toDateString()} - ${new Date(week.endDate).toDateString()}`,
        utilizationReport: utilizationReport?.pdfPath || 'Not submitted',
        csrReport: csrReport?.pdfPath || 'Not submitted',
      };
    });

    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error('[getEmployeeReports] Error:', error);
    return NextResponse.json({ 
      message: 'Error fetching employee reports',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}