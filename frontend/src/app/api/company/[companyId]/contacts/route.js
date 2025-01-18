import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Company from '@/app/api/lib/models/Company';


export async function POST(request, { params }) {
  try {
    await connectDB();
    const { name, email, phone } = await request.json();
    const company = await Company.findById(params.companyId);
    
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }
    company.contacts.push({ name, email, phone });
    await company.save();
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding contact', error: error.message }, { status: 500 });
  }
}