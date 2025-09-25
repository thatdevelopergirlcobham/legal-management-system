import { NextRequest, NextResponse } from 'next/server';
import { findCaseById, updateCase, deleteCase, getAllCases, findUserById } from '@/lib/mockData';

// GET /api/cases/[id] - Get a specific case
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseDoc = await findCaseById(params.id);

    if (!caseDoc) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(caseDoc);
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
    const body = await request.json();
    const { caseNumber, title, description, status, clientId, staffId } = body;

    // Check if case exists
    const existingCase = await findCaseById(params.id);
    if (!existingCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // If case number is being changed, check if it's already taken
    if (caseNumber && caseNumber !== existingCase.caseNumber) {
      const allCases = await getAllCases();
      const duplicateCase = allCases.find(c => c.caseNumber === caseNumber);
      if (duplicateCase) {
        return NextResponse.json(
          { error: 'Case number already exists' },
          { status: 400 }
        );
      }
    }

    // Verify client and staff exist if they're being updated
    if (clientId) {
      const client = await findUserById(clientId);
      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
    }

    if (staffId) {
      const staff = await findUserById(staffId);
      if (!staff) {
        return NextResponse.json(
          { error: 'Staff not found' },
          { status: 404 }
        );
      }
    }

    const updatedCase = await updateCase(params.id, {
      ...(caseNumber && { caseNumber }),
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(clientId && { clientId }),
      ...(staffId && { staffId })
    });

    return NextResponse.json(updatedCase);
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
    const deleted = await deleteCase(params.id);

    if (!deleted) {
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
