import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import CSR from '@/app/api/lib/models/csr';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const csrData = await CSR.find({ companyId: params.companyId })
      .select('serviceEngineer weekEndDate totals.totalWeekHours purposeOfVisit');

    const formattedData = csrData.map((item) => ({
      serviceEngineer: item.serviceEngineer,
      weekStartDate: item.weekEndDate.toISOString().split('T')[0],
      totalHours: item.totals.totalWeekHours,
      purposeOfVisit: item.purposeOfVisit,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching visit history', error: error.message }, { status: 500 });
  }
}