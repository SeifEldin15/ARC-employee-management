import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import CSR from '@/app/api/lib/models/csr';
import { verifyAuth } from '@/app/api/lib/auth';
import { generatePDF } from '@/app/api/lib/utils/PDF';

export async function POST(request) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const employeeId = user._id;

    // Validate weeklyTaskReport
    if (!Array.isArray(data.weeklyTaskReport) || data.weeklyTaskReport.length !== 7) {
      return NextResponse.json({
        error: 'weeklyTaskReport must be an array with 7 days of data.'
      }, { status: 400 });
    }

    const csr = new CSR({
      employeeId,
      ...data,
      totals: {
        totalWeekHours: data.weeklyTaskReport.reduce(
          (sum, day) => sum + (day.totalHours || 0),
          0
        ),
        totalWeekUSD: data.weeklyTaskReport.reduce(
          (sum, day) => sum + (day.totalUSD || 0),
          0
        ),
      }
    });

    const pdfPath = await generatePDF('csrTemplate', {
      ...data,
      totals: csr.totals
    });

    csr.pdfPath = pdfPath;
    await csr.save();

    return NextResponse.json({ 
      message: 'CSR submitted successfully!',
      pdfPath 
    }, { status: 200 });

  } catch (error) {
    console.error('[submitCSR] Error:', error);
    return NextResponse.json({ 
      error: 'Error submitting CSR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}