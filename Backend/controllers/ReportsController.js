import Workweek from '../models/workweek.js';
import Utilization from '../models/utilization.js';
import CSR from '../models/csr.js';

import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        const employeeId = req.user._id;

        const { WorkWeekNumber, year, SVR_Category, tasks, serviceEngineer } = req.body;

        const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);

        const report = new Utilization({
            employeeId,
            WorkWeekNumber,
            year,
            SVR_Category,
            tasks,
            serviceEngineer,
            totalHours
        });

        await report.save();

        // const templatePath = path.join(__dirname, './templates/utilizationReport.ejs');
        // const html = await ejs.renderFile(templatePath, {
        //     WorkWeekNumber,
        //     serviceEngineer,
        //     tasks,
        //     year
        // });

        // // Generate the PDF using Puppeteer
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.setContent(html, { waitUntil: 'domcontentloaded' });
        // const pdfPath = `../data/Utilization_Report/${WorkWeekNumber}_${serviceEngineer}.pdf`;
        // await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
        // await browser.close();

        // // Assuming the pendingReports for this week are being managed elsewhere
        // // Update the report for the employee if applicable
        // const workweek = await Workweek.findOne({ weekNumber: WorkWeekNumber });
        // if (!workweek) return res.status(400).json({ error: 'WorkWeek not found' });

        // const employeeReport = workweek.pendingReports.find(
        //     (report) => report.employeeId.toString() === employeeId
        // );

        // if (employeeReport) {
        //     const utilizationReport = employeeReport.reportTypes.find(rt => rt.type === 'Utilization');
        //     if (utilizationReport) {
        //         utilizationReport.pdfPath = pdfPath;
        //         utilizationReport.submittedAt = new Date();
        //     }
        // }

        // // Save updated workweek
        // await workweek.save();

        res.status(200).json({ message: 'Utilization report submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting utilization report', details: error.message });
    }
};


export const submitCSR = async (req, res) => {
    try {
        const {
            spvNumber,
            serviceEngineer,
            WorkWeekNumber,
            weekEndDate,
            customer,
            address,
            contact,
            email,
            mobileNumber,
            toolNumber,
            jobType,
            systemType,
            jiraTicketNumber,
            weeklyTaskReport = [],
            purposeOfVisit,
            solution,
            recommendations,
            additionalNotes,
            returnVisitRequired,
        } = req.body;

        // Validate weeklyTaskReport
        if (!Array.isArray(weeklyTaskReport) || weeklyTaskReport.length !== 7) {
            return res.status(400).json({
                error: 'weeklyTaskReport must be an array with 7 days of data.',
            });
        }

        // Validate fields in each day
        for (const day of weeklyTaskReport) {
            if (
                !day.date ||
                typeof day.travelHours !== 'number' ||
                typeof day.regularHours !== 'number' ||
                typeof day.overtimeHours !== 'number' ||
                typeof day.holidayHours !== 'number' ||
                typeof day.hourlyRate !== 'number'
            ) {
                return res.status(400).json({
                    error: 'Invalid weeklyTaskReport format. Ensure each day has date, travelHours, regularHours, overtimeHours, holidayHours, and hourlyRate.',
                });
            }
        }

        const employeeId = req.user._id;

        const csr = new CSR({
            employeeId,
            spvNumber,
            serviceEngineer,
            WorkWeekNumber,
            weekEndDate,
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
                totalWeekHours: weeklyTaskReport.reduce(
                    (sum, day) => sum + (day.totalHours || 0),
                    0
                ),
                totalWeekUSD: weeklyTaskReport.reduce(
                    (sum, day) => sum + (day.totalUSD || 0),
                    0
                ),
            },
            purposeOfVisit,
            solution,
            recommendations,
            additionalNotes,
            returnVisitRequired,
        });


        // Render HTML template
        const templatePath = path.join(__dirname, './templates/csrTemplate.ejs');
        const html = await ejs.renderFile(templatePath, {
            spvNumber,
            serviceEngineer,
            workWeek: WorkWeekNumber, // Map WorkWeekNumber to workWeek
            weekEndDate,
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
            returnVisitRequired,
        });
        var pdfPath ;
    // Generate PDF using Puppeteer
        try {
            const pdfDirectory = path.join(__dirname, '../data/CSR_Report');
        
            // Ensure the directory exists
            if (!fs.existsSync(pdfDirectory)) {
                fs.mkdirSync(pdfDirectory, { recursive: true });
            }
        
            pdfPath = path.join(pdfDirectory, `${WorkWeekNumber}_${spvNumber}_${serviceEngineer}.pdf`);
        
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }); 
                
            const page = await browser.newPage();
                
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
                
            await browser.close();

        } catch (error) {
            res.status(500).json({ error: 'Error generating PDF', details: error.message });
        }


        const workweek = await Workweek.findOne({ weekNumber: WorkWeekNumber });
        const employeeReport = workweek.pendingReports.find(
            (report) => report.employeeId.toString() === employeeId
        );
        
        console.log(employeeReport)
        if (employeeReport) {
            const CSR_Report = employeeReport.reportTypes.find(rt => rt.type === 'CSR');
            console.log(CSR_Report)
            if (CSR_Report) {
                CSR_Report.pdfPath = pdfPath;
                CSR_Report.submittedAt = new Date();
            }
        }

        // Save updated workweek
        await workweek.save();

        csr.pdfPath = pdfPath;
        await csr.save();

    res.status(200).json({ message: 'CSR submitted successfully!', pdfPath });

    } catch (error) {
        console.error('Error submitting CSR:', error);
        res.status(500).json({ error: 'Error submitting CSR', details: error.message });
    }
};



