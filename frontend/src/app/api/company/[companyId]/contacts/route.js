import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Company from '@/app/api/lib/models/Company';

export async function POST(request, { params }) {
  try {
    await connectDB();

    // Check if params and companyId are defined
    if (!params || !params.companyId) {
      return NextResponse.json({ message: 'Company ID is required' }, { status: 400 });
    }

    const { name, email, phone, role } = await request.json();

    // Validate companyId format (optional, but recommended)
    if (!/^[0-9a-fA-F]{24}$/.test(params.companyId)) {
      return NextResponse.json({ message: 'Invalid Company ID format' }, { status: 400 });
    }

    const company = await Company.findById(params.companyId);

    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    // Proceed with adding the contact or other logic here
    company.contacts.push({ name, email, phone, role });
    await company.save();


    return NextResponse.json({ message: 'Contact added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /company/:companyId/contacts:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}