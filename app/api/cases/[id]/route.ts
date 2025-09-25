import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CaseModel from '@/models/Case';
import UserModel from '@/models/User';

// GET /api/cases/[id] - Get a specific case
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const caseDoc = await CaseModel.findById(params.id)
      .populate('clientId', 'name email')
      .populate('staffId', 'name email');

    if (!caseDoc) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Convert to plain object
    const plainCase = {
      id: caseDoc._id.toString(),
      caseNumber: caseDoc.caseNumber,
      title: caseDoc.title,
      description: caseDoc.description,
      status: caseDoc.status,
      createdAt: caseDoc.createdAt?.toISOString(),
      updatedAt: caseDoc.updatedAt?.toISOString(),
      clientId: caseDoc.clientId?._id?.toString() || caseDoc.clientId,
      staffId: caseDoc.staffId?._id?.toString() || caseDoc.staffId
    };

    return NextResponse.json(plainCase);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case' },
      { status: 500 }
    );
  }
}

// PUT /api/cases/[id] - Update a case
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { caseNumber, title, description, status, clientId, staffId } = body;

    // Check if case exists
    const existingCase = await CaseModel.findById(params.id);
    if (!existingCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // If case number is being changed, check if it's already taken
    if (caseNumber && caseNumber !== existingCase.caseNumber) {
      const duplicateCase = await CaseModel.findOne({ caseNumber });
      if (duplicateCase) {
        return NextResponse.json(
          { error: 'Case number already exists' },
          { status: 400 }
        );
      }
    }

    // Verify client and staff exist if they're being updated
    if (clientId) {
      const client = await UserModel.findById(clientId);
      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
    }

    if (staffId) {
      const staff = await UserModel.findById(staffId);
      if (!staff) {
        return NextResponse.json(
          { error: 'Staff not found' },
          { status: 404 }
        );
      }
    }

    const updatedCase = await CaseModel.findByIdAndUpdate(
      params.id,
      {
        ...(caseNumber && { caseNumber }),
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(clientId && { clientId }),
        ...(staffId && { staffId })
      },
      { new: true, runValidators: true }
    )
      .populate('clientId', 'name email')
      .populate('staffId', 'name email');

    // Convert to plain object
    const plainCase = {
      id: updatedCase._id.toString(),
      caseNumber: updatedCase.caseNumber,
      title: updatedCase.title,
      description: updatedCase.description,
      status: updatedCase.status,
      createdAt: updatedCase.createdAt?.toISOString(),
      updatedAt: updatedCase.updatedAt?.toISOString(),
      clientId: updatedCase.clientId?._id?.toString() || updatedCase.clientId,
      staffId: updatedCase.staffId?._id?.toString() || updatedCase.staffId
    };

    return NextResponse.json(plainCase);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[id] - Delete a case
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const deletedCase = await CaseModel.findByIdAndDelete(params.id);

    if (!deletedCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}
