import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD, EMAIL_SERVICE } from '../config/env.js';

export const sendReminderEmail = async (employeeEmail, missingWeekS) => {
    const transporter = nodemailer.createTransport({
        service: EMAIL_SERVICE ,
        auth: {
            user: EMAIL_USER ,
            pass: EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: employeeEmail,
        subject: 'Missing Utilization Reports Reminder',
        text: `You have missing utilization reports for the following weeks: ${missingWeekS}. Please submit them as soon as possible.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}; 