import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { cookies } = request;
        const token = cookies.token;

        // Clear the cookie
        const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: -1 // Expire the cookie
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ 
            message: 'Server error during logout', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, { status: 500 });
    }
}
