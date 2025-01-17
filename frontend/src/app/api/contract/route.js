import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Contract from '@/app/api/lib/models/Contract';
import CSR from '@/app/api/lib/models/csr';

export async function POST(request) {
  try {
    await connectDB();
    const { customer, email, phone, address, contactName, srvNumber, contractHours, startDate, endDate, serviceType } = await request.json();
    
    const newContract = new Contract({
      customer,
      contactName,
      email,
      phone,
      address,
      srvNumber,
      contractHours,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      serviceType
    });
    
    await newContract.save();
    return NextResponse.json({ newContract }, { status: 201 });
  } catch (error) {
    console.error('Contract creation failed:', error);
    return NextResponse.json({ 
      message: 'Error creating contract',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const contracts = await Contract.find();
    
    const contractDetails = await Promise.all(contracts.map(async (contract) => {
      const csrData = await CSR.aggregate([
        { $match: { srvNumber: contract.srvNumber } },
        { $group: { _id: null, totalHours: { $sum: "$totals.totalWeekHours" } } }
      ]);

      const usedHours = csrData.length > 0 ? csrData[0].totalHours : 0;

      return {
        _id: contract._id,
        company: contract.customer,
        contractType: contract.serviceType,
        contractHours: contract.contractHours,
        usedHours,
      };
    }));

    return NextResponse.json(contractDetails, { status: 200 });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ 
      message: 'Error fetching contracts',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
