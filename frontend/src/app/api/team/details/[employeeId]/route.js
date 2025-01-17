import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Workweek from '@/app/api/lib/models/workweek';
import Utilization from '@/app/api/lib/models/utilization';
import { verifyAuth } from '@/app/api/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { employeeId } = params;
    const workweeks = await Workweek.find({}).sort({ weekNumber: -1 });
    const utilizationData = await Utilization.find({ employeeId });

    if (!workweeks || workweeks.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No workweek data found for this employee' },
        { status: 404 }
      );
    }

    const reportData = workweeks.map((ww) => {
      const utilizationReportPath = ww.pendingReports.find(
        (report) => report.employeeId.toString() === employeeId
      )?.reportTypes.find(reportType => reportType.type === 'Utilization');

      const utilizationReport = utilizationData.find(
        (util) => util.WeekNumber === ww.weekNumber && util.year === ww.year
      );

      const csrReport = ww.pendingReports.find(
        (report) => report.employeeId.toString() === employeeId
      )?.reportTypes.find(reportType => reportType.type === 'CSR');

      return {
        week: ww.weekNumber,
        dateRange: `${ww.startDate} - ${ww.endDate}`,
        sumWorkHours: utilizationReport ? utilizationReport.totalHours || 0 : 0,
        utilizationPdfPath: utilizationReportPath ? utilizationReportPath.pdfPath : null,
        csrPdfPath: csrReport ? csrReport.pdfPath : null,
      };
    });

    const totalBillableHours = utilizationData.reduce((sum, record) => sum + (record.totalHours || 0), 0);
    const averageUtilization = utilizationData.length > 0
      ? utilizationData.reduce((sum, record) => sum + (record.totalHours || 0), 0) / utilizationData.length
      : 0;

    const responseData = {
      metrics: {
        averageUtilization: parseFloat(averageUtilization.toFixed(2)),
        totalBillableHours,
      },
      utilizationHistory: reportData,
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 200 });
  } catch (error) {
    console.error('Error in getEmployeeDetails:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching report details', error: error.message },
      { status: 500 }
    );
  }
}