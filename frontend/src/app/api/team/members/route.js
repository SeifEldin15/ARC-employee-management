import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import User from '@/app/api/lib/models/User';
import { verifyAuth } from '@/app/api/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const employees = await User.find({ managerId: user._id }).sort('Region');
    
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error('Error in getManagerTeam:', error);
    return NextResponse.json(
      { message: 'Error fetching employees', error: error.message },
      { status: 500 }
    );
  }
}