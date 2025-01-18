import { NextResponse } from 'next/server';
import { sendReminderEmail } from '@/app/api/lib/utils/emailService'; 
export async function POST(request) {
    const { employeeEmail, missingWeek } = await request.json(); 

    if (!employeeEmail || !missingWeek) {
        return NextResponse.json({ message: 'Employee email and missing weeks are required' }, { status: 400 });
    }

    try {
        await sendReminderEmail(employeeEmail, missingWeek); 
        return NextResponse.json({ message: 'Reminder email sent successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error sending reminder email:', error);
        return NextResponse.json({ message: 'Error sending reminder email', error: error.message }, { status: 500 });
    }
}
