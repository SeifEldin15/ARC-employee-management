import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Company from '@/app/api/lib/models/Company';

export async function DELETE(request, { params }) {
    await connectDB(); // Connect to the database

    const { companyId, toolId } = params; // Extract companyId and toolId from the URL parameters

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return NextResponse.json({ message: 'Company not found' }, { status: 404 });
        }

        const tool = company.tools.id(toolId);
        if (!tool) {
            return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
        }

        tool.remove(); // Remove the tool
        await company.save(); // Save the updated company document

        return NextResponse.json({ message: 'Tool deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting tool:', error);
        return NextResponse.json({ message: 'Error deleting tool', error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await connectDB();

    const { companyId, toolId } = params;
    const updateData = await request.json();

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return NextResponse.json({ message: 'Company not found' }, { status: 404 });
        }

        const tool = company.tools.id(toolId);
        if (!tool) {
            return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
        }

        // Update tool fields
        Object.assign(tool, updateData);
        await company.save();

        return NextResponse.json({ message: 'Tool updated', tool }, { status: 200 });
    } catch (error) {
        console.error('Error updating tool:', error);
        return NextResponse.json({ message: 'Error updating tool', error: error.message }, { status: 500 });
    }
}


