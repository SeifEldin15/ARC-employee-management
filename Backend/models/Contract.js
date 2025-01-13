import mongoose from 'mongoose' ;

const contractSchema = new mongoose.Schema({

    customer: { type: String ,required: true } , 
    contactName: { type: String ,required: true } , 
    email: { type: String ,required: true } , 
    phone:{ type: String ,required: true } , 
    address:{ type: String ,required: true } , 
    srvNumber: { type: String ,required: true , unique: true } , 
    contractHours: { type: Number ,required: true } , 
    startDate: { type: Date ,required: true } , 
    endDate: { type: Date ,required: true } , 
    serviceType: {
        type: String,
        enum: ['Service', 'PC'], 
        required: true
    }
});

export default mongoose.model('Contract', contractSchema);
