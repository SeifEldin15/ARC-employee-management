import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const getManagerTeam = async (req, res) => {
    try {
        const { managerId } = req.user._id;
        const employees = await User.find({ manager_id: managerId, role: 'Employee' }).sort('Region');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

export const addManagerTeamMember = async (req, res) => {
    try {
        const { name, password, Region, job_title, email, phone, manager_id } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new employee
        const newEmployee = new User({
            name,
            password: hashedPassword,
            Region,
            role: 'Employee',
            job_title,
            email,
            phone,
            manager_id
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
};

export const deleteManagerTeamMember = async (req, res) => {
    try {
        const { employeeId } = req.params;
        await User.findByIdAndDelete(employeeId);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
}; 