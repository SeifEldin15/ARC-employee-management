import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Company from '@/app/api/lib/models/Company';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const company = await Company.findById(params.companyId).select('name tools');
    
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({
      company: company.name,
      tools: company.tools
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching tools', error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { PNumber, toolDescription, warrantyStart, warrantyEnd } = await request.json();
    const company = await Company.findById(params.companyId);
    
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    company.tools.push({ PNumber, toolDescription, warrantyStart, warrantyEnd });
    await company.save();
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding tool', error: error.message }, { status: 500 });
  }
}