import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import Utilization from '../models/utilization.js';
import Workweek from '../models/workweek.js';

export const submitUtilizationReport = async (req, res) => {
    try {
        const { employeeId, tasks, serviceEngineer } = req.body;

        const today = new Date();
        const currentWeek = await Workweek.findOne({ startDate: { $lte: today }, endDate: { $gte: today } });

        if (!currentWeek) return res.status(400).json({ error: 'No active work week found.' });

        const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);

        const report = new Utilization({
            employeeId,
            workWeek: currentWeek.weekNumber,
            year: currentWeek.year,
            tasks,
            totalHours
        });

        await report.save();

        // Generate HTML content
        const templatePath = path.join(__dirname, '../templates/utilizationReport.ejs');
        const html = await ejs.renderFile(templatePath, {
            startDate: currentWeek.startDate.toDateString(),
            endDate: currentWeek.endDate.toDateString(),
            workWeek: currentWeek.weekNumber,
            serviceEngineer,
            tasks
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const pdfPath = `/data/Utilization_Report_${currentWeek.weekNumber}_${serviceEngineer}.pdf`;
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
        await browser.close();


         const employeeReport = currentWeek.pendingReports.find(report => report.employeeId.toString() === employeeId);
         if (employeeReport) {
             const utilizationReport = employeeReport.reportTypes.find(rt => rt.type === 'Utilization');
             if (utilizationReport) {
                 utilizationReport.pdfPath = pdfPath;
                 utilizationReport.submittedAt = new Date();
             }
         }
         await currentWeek.save();

        res.status(200).json({ message: 'Utilization report submitted successfully!', pdfPath });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting utilization report', details: error.message });
    }
};
