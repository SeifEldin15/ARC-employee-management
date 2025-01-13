import Contract from '../models/Contract.js'; 
import Company from '../models/Company.js'
import CSR from '../models/csr.js';

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
        console.error('Contract creation failed:', {
            error: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({ 
            message: 'Error creating contract', 
            details: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
};

export const deleteContract = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedContract = await Contract.findByIdAndDelete(id);
        if (!deletedContract) return res.status(404).json({ message: 'Contract not found' });

        res.status(200).json({ message: 'Contract deleted successfully'});
    } catch (error) {
        console.error('Contract deletion failed:', {
            error: error.message,
            stack: error.stack,
            contractId: req.params.id
        });
        res.status(500).json({ 
            message: 'Error deleting contract', 
            details: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
};

export const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find().select('');
        const contractDetails = await Promise.all(contracts.map(async (contract) => {

            const csrData = await CSR.aggregate([
                { $match: { srvNumber: contract.srvNumber } },
                { $group: { _id: null, totalHours: { $sum: "$totals.totalWeekHours" } } }
            ]);

            const usedHours = csrData.length > 0 ? csrData[0].totalHours : 0;

            return {
                _id : contract._id ,
                company : contract.customer,
                contractType : contract.serviceType ,
                contractHours : contract.contractHours ,
                usedHours, 
            };
        }));


        res.status(200).json(contractDetails);
    } catch (error) {
        console.error('Error fetching contract details:', error);
        res.status(500).json({ message: 'Error fetching contract details', error: error.message });
    }
};


export const getContractDetails = async (req, res) => {

    const { contractId } = req.params;

    try {
        const contract = await Contract.findById(contractId);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        const csrData = await CSR.aggregate([
            { $match: { srvNumber: contract.srvNumber } },
            { $group: { _id: null, totalHours: { $sum: "$totals.totalWeekHours" } } }
        ]);

        const usedHours = csrData.length > 0 ? csrData[0].totalHours : 0;

        res.status(200).json({
            contract,
            usedHours,
        });
    } catch (error) {

        res.status(500).json({ message: 'Error fetching contract details', error: error.message });

    }
};
