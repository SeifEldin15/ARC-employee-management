import mongoose from 'mongoose' ;

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String , required: true },
    region: { type: String , required: true },
    contacts: [
        {
            name: { type: String, required: true },
            email: { type: String , required: true, unique: true  },
            phone: { type: String , required: true},
            role: { type: String , default: 'none' }
        }
    ],
    tools: [
        {
            PNumber: { type: String, required: true },
            toolDescription: { type: String, required: true },
            warrantyStart: { type: Date, required: true },
            warrantyEnd: { type: Date, required: true },
        }
    ]
}, { timestamps: true });


export default mongoose.models.Company || mongoose.model('Company', companySchema);
