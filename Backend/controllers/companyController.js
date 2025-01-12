import Company from '../models/Company.js';

export const createCompany = async (req, res) => {
        const { name, address, region, contacts = [], tools = [] } = req.body;
        try {
            const newCompany = await Company.create({ name, address, region, contacts, tools });
            res.status(201).json(newCompany);
        } catch (error) {
            res.status(500).json({ message: 'Error creating company', error: error.message });
        }
    };

export const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        await company.remove();
        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error: error.message });
    }
};

export const deleteTool = async (req, res) => {
    const { companyId, toolId } = req.params;

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        company.tools.id(toolId).remove();
        await company.save();
        res.json({ message: 'Tool deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tool', error: error.message });
    }
};

export const addContact = async (req, res) => {
    const { companyId } = req.params;
    const { name, email, phone } = req.body;

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        company.contacts.push({ name, email, phone });
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact', error: error.message });
    }
};

export const deleteContact = async (req, res) => {
    const { companyId, contactId } = req.params;

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        company.contacts.id(contactId).remove();
        await company.save();
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

export const addTool = async (req, res) => {
    const { companyId } = req.params;
    const { PNumber, toolDescription, warrantyStart, warrantyEnd } = req.body;

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        company.tools.push({ PNumber, toolDescription, warrantyStart, warrantyEnd });
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error adding tool', error: error.message });
    }
};

export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select(' name address contacts ');
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};

export const getCompanyDetails = async (req, res) => {
    const { companyId } = req.params;
    try {
        const company = await Company.findById(companyId).select('name address tools');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({
            company: company.name,
            details: {
                address: company.address,
                tools_installed: company.tools,
                contacts: company.contacts
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact details', error: error.message });
    }
};

export const getContacts = async (req, res) => {
    try {
        const companies = await Company.find().select('name contacts');
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};

export const getTools = async (req, res) => {
    const { companyId } = req.params;
    try {
        const company = await Company.findById(companyId).select('name tools');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({
            company: company.name,
            tools: company.tools
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tools', error: error.message });
    }
}; 