import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Utilization from '@/app/api/lib/models/utilization';
import { verifyAuth } from '@/app/api/lib/auth';
import { generatePDF } from '@/app/api/lib/utils/PDF';
import { submitReport } from '@/app/api/lib/utils/submitReport';

export async function POST(request) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const employeeId = user._id;

    // Check if the tasks array is empty

    if(!data.weekNumber ){
      return NextResponse.json({ message: 'Week number is required.' }, { status: 400 });
    }
    
    if (!data.tasks || data.tasks.length === 0) {
      return NextResponse.json({ message: 'No tasks submitted for this week.' }, { status: 400 });
    }

    const totalHours = data.tasks.reduce((sum, task) => sum + task.hours, 0);

    // Check if total hours is zero
    if (totalHours === 0) {
      return NextResponse.json({ message: 'Total hours cannot be zero.' }, { status: 400 });
    }

    const report = new Utilization({
      employeeId,
      ...data,
      totalHours
    });

    // Generate PDF using the utility function
    const pdfPath = await generatePDF('utilizationReport', {
      ...data,
      totalHours
    });

    report.pdfPath = pdfPath;

    // Submit the report
    await submitReport(data.WeekNumber, employeeId, "Utilization", pdfPath);

    await report.save();

    return NextResponse.json({ 
      message: 'Utilization report submitted successfully!',
    }, { status: 200 });

  } catch (error) {
    console.error('[submitUtilization] Error:', error);
    return NextResponse.json({ 
      error: 'Error submitting utilization report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}