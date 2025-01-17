import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import CSR from '@/app/api/lib/models/csr';
import Utilization from '@/app/api/lib/models/utilization';
import { verifyAuth } from '@/app/api/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get all reports for the authenticated user
    const csrReports = await CSR.find({ employeeId: user._id })
      .select('weekEndDate totals purposeOfVisit pdfPath')
      .sort('-weekEndDate');

    const utilizationReports = await Utilization.find({ employeeId: user._id })
      .select('WeekNumber year totalHours pdfPath')
      .sort('-year -WeekNumber');

    // Calculate summary metrics
    const totalCSRHours = csrReports.reduce((sum, report) => 
      sum + (report.totals?.totalWeekHours || 0), 0);
    
    const totalUtilizationHours = utilizationReports.reduce((sum, report) => 
      sum + (report.totalHours || 0), 0);

    return NextResponse.json({
      summary: {
        totalCSRHours,
        totalUtilizationHours,
        totalReports: csrReports.length + utilizationReports.length
      },
      reports: {
        csr: csrReports,
        utilization: utilizationReports
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[getReports] Error:', error);
    return NextResponse.json({ 
      error: 'Error fetching reports',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
