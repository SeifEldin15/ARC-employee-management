import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Contract from '@/app/api/lib/models/Contract';
import CSR from '@/app/api/lib/models/csr';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const contract = await Contract.findById(params.contractId);
    
    if (!contract) {
      return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }

    const csrData = await CSR.aggregate([
      { $match: { srvNumber: contract.srvNumber } },
      { $group: { _id: null, totalHours: { $sum: "$totals.totalWeekHours" } } }
    ]);

    const usedHours = csrData.length > 0 ? csrData[0].totalHours : 0;

    return NextResponse.json({ contract, usedHours }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error fetching contract details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const deletedContract = await Contract.findByIdAndDelete(params.contractId);
    
    if (!deletedContract) {
      return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contract deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error deleting contract',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
