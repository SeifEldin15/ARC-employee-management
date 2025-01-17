import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import User from '@/app/api/lib/models/User';
import { verifyAuth } from '@/app/api/lib/auth';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { employeeId } = params;
    await User.findByIdAndDelete(employeeId);
    
    return NextResponse.json(
      { message: 'Employee deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in deleteManagerTeamMember:', error);
    return NextResponse.json(
      { message: 'Error deleting employee', error: error.message },
      { status: 500 }
    );
  }
}