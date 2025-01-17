import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import User from '@/app/api/lib/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    
    // Add debugging to check all users in the database
    const allUsers = await User.find({});
    console.log('All users in database:', allUsers.map(user => ({
      email: user.email,
      role: user.role,
      _id: user._id
    })));
    
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing credentials');
      return NextResponse.json({ 
        message: 'Email and password are required' 
      }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('Database query result:', {
      emailSearched: email.toLowerCase().trim(),
      userFound: !!user,
      userEmail: user?.email,
      userRole: user?.role
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ 
        message: 'Invalid credentials' 
      }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return NextResponse.json({ 
        message: 'Invalid credentials' 
      }, { status: 400 });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    const response = NextResponse.json({
      token: token,
      role: user.role
    }, { status: 200 });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 3 // 3 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'Server error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}
