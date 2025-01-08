import Contact from '../../models/Contact.js';

export const createContact = async (req, res) => {
    const { company_id, contact_name, email, phone } = req.body;
    try {
        const newContact = await Contact.create({ company_id, contact_name, email, phone });
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact', error: error.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        await contact.remove();
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
}; 