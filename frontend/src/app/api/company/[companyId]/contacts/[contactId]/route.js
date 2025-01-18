import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Company from '@/app/api/lib/models/Company';


export async function DELETE(request, { params }) {
    await connectDB();

    const { companyId, contactId } = params;

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            console.log('Company not found');
            return NextResponse.json({ message: 'Company not found' }, { status: 404 });
        }

        const contact = company.contacts.id(contactId);
        if (!contact) {
            console.log('Contact not found');
            return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
        }

        contact.remove();
        await company.save();

        return NextResponse.json({ message: 'Contact deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ message: 'Error deleting contact', error: error.message }, { status: 500 });
    }
}