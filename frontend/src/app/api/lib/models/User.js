import mongoose from 'mongoose' ;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    Region: { type: String, enum: ['US-EAST', 'US-WEST','EUROPE','ASIA'] },
    role: { type: String, enum: ['Employee', 'Manager'], required: true },
    job_title: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
