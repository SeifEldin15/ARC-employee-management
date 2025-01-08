import express from 'express';
import connectDB from './Backend/config/db.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import contractRoutes from './routes/contractRoutes.js';

const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/contract', contractRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));