import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import User from '@/app/api/lib/models/User';
import bcrypt from 'bcrypt';
import { verifyAuth } from '@/app/api/lib/auth';

export async function POST(request) {
    await connectDB();

    const { oldPassword, newPassword, confirmPassword } = await request.json();

    if (!oldPassword || !newPassword || !confirmPassword) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
        return NextResponse.json({ message: 'New password and confirm password do not match' }, { status: 400 });
    }

    try {
        const getId = await verifyAuth(request);
        
        const user = await User.findById(getId._id);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Old password is incorrect' }, { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ 
            message: 'Server error', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, { status: 500 });
    }
}
