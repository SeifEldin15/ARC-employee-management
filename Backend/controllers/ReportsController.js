import Workweek from '../models/workweek.js';
import Utilization from '../models/utilization.js';
import CSR from '../models/csr.js';

import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

export const getEmployeeReports = async (req, res) => {
    try {
        const employeeId = req.user._id;
        const workweeks = await Workweek.find({}).populate('pendingReports.employeeId');

        const reports = await Promise.all(workweeks.map(async (week) => {
            const employeeReport = week.pendingReports.find(report => report.employeeId.toString() === employeeId);
            const utilizationReport = employeeReport?.reportTypes.find(rt => rt.type === 'Utilization');
            const csrReport = employeeReport?.reportTypes.find(rt => rt.type === 'CSR');

            return {
                weekNumber: week.weekNumber,
                dateRange: `${week.startDate.toDateString()} - ${week.endDate.toDateString()}`,
                utilizationReport: utilizationReport ? utilizationReport.pdfPath : 'Not submitted',
                csrReport: csrReport ? csrReport.pdfPath : 'Not submitted'
            };
        }));

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee reports', error: error.message });
    }
};

export const submitUtilization = async (req, res) => {
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



