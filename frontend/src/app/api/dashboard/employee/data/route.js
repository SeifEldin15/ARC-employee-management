import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Utilization from '@/app/api/lib/models/utilization';
import User from '@/app/api/lib/models/User';
import { verifyAuth } from '@/app/api/lib/auth';
import Workweek from '@/app/api/lib/models/workweek';

export async function GET(request) {
    try {
        await connectDB();
        
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }


        const reportSummary = [];


        const workweeks = await Workweek.find({}).sort({ weekNumber: 1 });
        
        // Loop through all weeks of the current year
        for (const week of workweeks) {
            const utilizationRecords = await Utilization.find({
                WeekNumber: week.weekNumber,
                year: week.year,
                employeeId: user._id
            });

            let reportsSubmitted = 0 ;
             // Reset hoursPerDay for each week
             const hoursPerDay = {
                Sunday: 0,
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0,
                Saturday: 0
            };

            // Check which employees submitted reports for the current week
            for (const record of utilizationRecords) {
                const submitted = record.employeeId.equals(user._id);
                reportsSubmitted += submitted ? 1 : 0;
            }

            utilizationRecords.forEach(record => {
                record.tasks.forEach(task => {
                    if (hoursPerDay[task.day] !== undefined) {
                        hoursPerDay[task.day] += task.hours; 
                    }
                });
            });

            reportSummary.push({
                week: week.weekNumber,
                year: week.year,
                reportsSubmitted: reportsSubmitted, 
                hoursPerDay 

            });
        }

        return NextResponse.json({
            reportSummary
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching report summary:', error);
        return NextResponse.json({ message: 'Error fetching data', error: error.message }, { status: 500 });
    }
}
    