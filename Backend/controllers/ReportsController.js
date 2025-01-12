import Workweek from '../models/workweek.js';
import Utilization from '../models/utilization.js';
import CSR from '../models/csr.js';

import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import {submitReport } from '../utils/submitReport.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getEmployeeReports = async (req, res) => {
    console.log('[getEmployeeReports] Request:', {
        employeeId: req.user._id,
        timestamp: new Date().toISOString()
    });
    try {
        const employeeId = req.user._id;
        const workweeks = await Workweek.find({}).populate('pendingReports.employeeId');

        const reports = await Promise.all(workweeks.map(async (week) => {
            const employeeReport = week.pendingReports.find(report => report.employeeId.toString() === employeeId);
            const utilizationReport = employeeReport?.reportTypes.find(rt => rt.type === 'Utilization');
            const csrReport = employeeReport?.reportTypes.find(rt => rt.type === 'CSR');

            return {
                weekNumber: week.weekNumber,
                dateRange: `${week.startDate} - ${week.endDate}`,
                utilizationReport: utilizationReport ? utilizationReport.pdfPath : 'Not submitted',
                csrReport: csrReport ? csrReport.pdfPath : 'Not submitted'
            };
        }));

        res.status(200).json(reports);
    } catch (error) {
        console.error('[getEmployeeReports] Error:', error);
        res.status(500).json({ 
            message: 'Error fetching employee reports', 
            error: error.message 
        });
    }
};

export const submitUtilization = async (req, res) => {
    console.log('[submitUtilization] Request:', {
        employeeId: req.user._id,
        workWeek: req.body.WorkWeekNumber,
        year: req.body.year,
        timestamp: new Date().toISOString(),
        body: req.body
    });
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


        const templatePath = path.join(__dirname, './templates/utilizationReport.ejs');
        const html = await ejs.renderFile(templatePath, {
            WorkWeekNumber,
            serviceEngineer,
            SVR_Category,
            tasks,
            totalHours
        });

        // Generate PDF using Puppeteer
        let pdfPath ; 
        const pdfDirectory = path.join(__dirname, '../data/Utilization_Report/');
    
        // Ensure the directory exists
        if (!fs.existsSync(pdfDirectory)) {
            fs.mkdirSync(pdfDirectory, { recursive: true });
        }
    
        pdfPath = path.join(pdfDirectory, `WW${WorkWeekNumber}_${serviceEngineer}.pdf`);
    
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });   
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });    
        await browser.close();

        submitReport(WorkWeekNumber , employeeId ,"Utilization" , pdfPath )

        await report.save();

        res.status(200).json({ message: 'Utilization report submitted successfully!' });

    } catch (error) {
        console.error('[submitUtilization] Error:', {
            employeeId: req.user._id,
            workWeek: req.body.WorkWeekNumber,
            error: error.message
        });
        res.status(500).json({ 
            error: 'Error submitting utilization report', 
            details: error.message 
        });
    }
};


export const submitCSR = async (req, res) => {
    console.log('[submitCSR] Request:', {
        employeeId: req.user._id,
        spvNumber: req.body.spvNumber,
        workWeek: req.body.WorkWeekNumber,
        timestamp: new Date().toISOString(),
        body: req.body
    });
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
            workWeek: WorkWeekNumber,
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
        
            pdfPath = path.join(pdfDirectory, `WW${WorkWeekNumber}_${spvNumber}_${serviceEngineer}.pdf`);
        
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

        submitReport(WorkWeekNumber , employeeId ,"CSR" , pdfPath )

        csr.pdfPath = pdfPath;
        await csr.save();

    res.status(200).json({ message: 'CSR submitted successfully!', pdfPath });

    } catch (error) {
        console.error('[submitCSR] Error:', {
            employeeId: req.user._id,
            spvNumber: req.body.spvNumber,
            workWeek: req.body.WorkWeekNumber,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: 'Error submitting CSR', 
            details: error.message 
        });
    }
};



