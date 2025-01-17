import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import User from '@/app/api/lib/models/User';
import bcrypt from 'bcrypt';
import { verifyAuth } from '@/app/api/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, password, Region, job_title, email, phone } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new User({
      name,
      password: hashedPassword,
      Region,
      role: 'Employee',
      job_title,
      email,
      phone,
      managerId: user._id
    });

    await newEmployee.save();
    
    return NextResponse.json(
      { message: 'Employee added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in addManagerTeamMember:', error);
    return NextResponse.json(
      { message: 'Error adding employee', error: error.message },
      { status: 500 }
    );
  }
}