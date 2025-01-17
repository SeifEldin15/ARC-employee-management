import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

export async function generatePDF(templateName, data) {
  try {
    // Use process.cwd() to get the correct base path
    const templatesDir = path.join(process.cwd(), 'src', 'app', 'api', 'lib', 'templates');
    const templatePath = path.join(templatesDir, `${templateName}.ejs`);
    
    const html = await ejs.renderFile(templatePath, data);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html);
    
    // Generate PDF file name with timestamp
    const timestamp = new Date().getTime();
    const pdfPath = path.join(process.cwd(), 'public', 'reports', `utilization-${timestamp}.pdf`);
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    
    await browser.close();
    
    // Return the relative path for storage in the database
    return `/reports/utilization-${timestamp}.pdf`;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
}