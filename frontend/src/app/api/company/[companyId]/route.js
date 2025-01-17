import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Company from '@/app/api/lib/models/Company';

export async function GET(request, { params }) {
  try {
    const companyId = await params.companyId;
    await connectDB();
    const company = await Company.findById(companyId)
      .select('name address region contacts tools');
    
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({
      company: company.name,
      address: company.address,
      region: company.region,
      details: {
        contacts: company.contacts,
        tools_installed: company.tools
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching company details', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const companyId = await params.companyId;
    await connectDB();
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }
    await company.deleteOne();
    return NextResponse.json({ message: 'Company deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting company', error: error.message }, { status: 500 });
  }
}