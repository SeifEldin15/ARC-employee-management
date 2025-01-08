import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import CSR from '../models/csr.js';
import Workweek from '../models/workweek.js';

export const submitCSR = async (req, res) => {
    try {
        const {
            spvNumber,
            serviceEngineer,
            customer,
            address,
            contact,
            email,
            mobileNumber,
            toolNumber,
            jobType,
            systemType,
            jiraTicketNumber,
            weeklyTaskReport,
            purposeOfVisit,
            solution,
            recommendations,
            additionalNotes,
            returnVisitRequired
        } = req.body;

        // Assuming req.user is set by authentication middleware
        const employeeId = req.user._id;

        // Fetch Current Workweek
        const today = new Date();
        const currentWeek = await Workweek.findOne({ startDate: { $lte: today }, endDate: { $gte: today } });

        if (!currentWeek) return res.status(400).json({ error: 'No active workweek found.' });

        const csr = new CSR({
            employeeId,
            spvNumber,
            serviceEngineer,
            workWeek: currentWeek.weekNumber,
            weekEndDate: currentWeek.endDate,
            customer,
            address,
            contact,
            email,
            mobileNumber,
            toolNumber,
            jobType,
            systemType,
            jiraTicketNumber,
            weeklyTaskReport,
            totals: {
                totalWeekHours: weeklyTaskReport.reduce((sum, day) => sum + day.totalHours, 0),
                totalWeekUSD: weeklyTaskReport.reduce((sum, day) => sum + day.totalUSD, 0)
            },
            purposeOfVisit,
            solution,
            recommendations,
            additionalNotes,
            returnVisitRequired
        });

        await csr.save();

        // Render HTML template
        const templatePath = path.join(__dirname, '../templates/csrTemplate.ejs');
        const html = await ejs.renderFile(templatePath, {
            spvNumber,
            serviceEngineer,
            workWeek: currentWeek.weekNumber,
            weekEndDate: currentWeek.endDate.toDateString(),
            customer,
            address,
            contact,
            email,
            mobileNumber,
            toolNumber,
            jobType,
            systemType,
            jiraTicketNumber,
            weeklyTaskReport,
            totals: csr.totals,
            purposeOfVisit,
            solution,
            recommendations,
            additionalNotes,
            returnVisitRequired
        });

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const pdfPath = `/data/CSR_Report/${currentWeek.weekNumber}_${spvNumber}_${serviceEngineer}.pdf`;
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
        await browser.close();

        // Update Workweek with PDF path
        const employeeReport = currentWeek.pendingReports.find(report => report.employeeId.toString() === employeeId);
        if (employeeReport) {
            const csrReport = employeeReport.reportTypes.find(rt => rt.type === 'CSR');
            if (csrReport) {
                csrReport.pdfPath = pdfPath;
                csrReport.submittedAt = new Date();
            }
        }
        await currentWeek.save();

        res.status(200).json({ message: 'CSR submitted successfully!', pdfPath });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting CSR', details: error.message });
    }
};
