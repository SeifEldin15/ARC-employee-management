import Tools from '../../models/Tools.js';

export const createTool = async (req, res) => {
    const { company_id, PNumber, toolDescription, warrantyStart, warrantyEnd } = req.body;
    try {
        const newTool = await Tools.create({ company_id, PNumber, toolDescription, warrantyStart, warrantyEnd });
        res.status(201).json(newTool);
    } catch (error) {
        res.status(500).json({ message: 'Error creating tool', error: error.message });
    }
};

export const deleteTool = async (req, res) => {
    try {
        const tool = await Tools.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        await tool.remove();
        res.json({ message: 'Tool deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tool', error: error.message });
    }
}; 