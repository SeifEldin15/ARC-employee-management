import nodemailer from 'nodemailer';

export const sendReminderEmail = async (employeeEmail, missingWeek) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE ,
        auth: {
            user: process.env.EMAIL_USER ,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employeeEmail,
        subject: 'Missing Utilization Reports Reminder',
        text: `You have missing utilization reports for the following weeks: ${missingWeek}. Please submit them as soon as possible.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}; 


