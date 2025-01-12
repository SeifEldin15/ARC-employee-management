import Contract from '../models/Contract.js'; 
import Company from '../models/Company.js'

export const createContract = async (req, res) => {
    try {
        const { customer, email , phone , address , contactName, srvNumber, contractHours, startDate, endDate, serviceType } = req.body;
        const newContract = new Contract({
            customer,
            contactName,
            email ,
            phone ,
            address ,
            srvNumber,
            contractHours,
            startDate: new Date(startDate), 
            endDate: new Date(endDate),     
            serviceType
        });
        await newContract.save();
        res.status(201).json({ newContract });
    } catch (error) {
        res.status(500).json({ message: 'Error creating contract', error: error.message });
    }
};

export const deleteContract = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedContract = await Contract.findByIdAndDelete(id);
        if (!deletedContract) return res.status(404).json({ message: 'Contract not found' });

        res.status(200).json({ message: 'Contract deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contract', error: error.message });
    }
};

export const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find().select('customer serviceType contractHours');
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contracts', error: error.message });
    }
};
