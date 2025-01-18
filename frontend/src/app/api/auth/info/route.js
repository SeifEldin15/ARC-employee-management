import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import User from '@/app/api/lib/models/User';
import { verifyAuth } from '@/app/api/lib/auth';

export async function GET(request, { params }) {
    await connectDB(); 

    const userId = await verifyAuth(request);

    try {
        const user = await User.findById(userId._id); 
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { password, ...userInfo } = user.toObject(); 
        return NextResponse.json(userInfo, { status: 200 });
    } catch (error) {
        console.error('Error fetching user information:', error);
        return NextResponse.json({ message: 'Error fetching user information', error: error.message }, { status: 500 });
    }
}
