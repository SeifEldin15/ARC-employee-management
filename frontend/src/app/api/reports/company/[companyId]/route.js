import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import CSR from '@/app/api/lib/models/csr';
import { verifyAuth } from '@/app/api/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const csrData = await CSR.find({ 
      companyId: params.companyId,
      employeeId: user._id 
    }).select('serviceEngineer weekEndDate totals.totalWeekHours purposeOfVisit');

    const formattedData = csrData.map((item) => ({
      serviceEngineer: item.serviceEngineer,
      weekStartDate: item.weekEndDate.toISOString().split('T')[0],
      totalHours: item.totals.totalWeekHours,
      purposeOfVisit: item.purposeOfVisit,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching CSR data for company:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch CSR data for company',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}