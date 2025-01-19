import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Workweek from '@/app/api/lib/models/workweek';

export async function GET(request) {
    try {
        await connectDB();

        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const days = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

        const currentWorkweek = await Workweek.findOne({
            weekNumber: weekNumber,
            year: today.getFullYear()
        });

        if (!currentWorkweek) {
            return NextResponse.json({ message: 'No active workweek found.' }, { status: 404 });
        }

        return NextResponse.json(currentWorkweek, { status: 200 });
    } catch (error) {
        console.error('Error fetching current workweek:', error);
        return NextResponse.json({ error: 'Error fetching current workweek' }, { status: 500 });
    }
}
