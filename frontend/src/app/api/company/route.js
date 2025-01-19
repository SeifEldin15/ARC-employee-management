import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Company from '@/app/api/lib/models/Company';

export async function POST(request) {
  try {
    await connectDB();
    const { name, address, region, contacts = [], tools = [] } = await request.json();
    const newCompany = await Company.create({ name, address, region, contacts, tools });
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating company', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find().select('name address contacts ');
    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching companies', error: error.message }, { status: 500 });
  }
}

