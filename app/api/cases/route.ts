import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CaseModel from '@/models/Case';
import UserModel from '@/models/User';

// GET /api/cases - Get all cases
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const staffId = searchParams.get('staffId');

    const filter: any = {};
    if (status) filter.status = status;
    if (clientId) filter.clientId = clientId;
    if (staffId) filter.staffId = staffId;

    const cases = await CaseModel.find(filter)
      .populate('clientId', 'name email')
      .populate('staffId', 'name email')
      .sort({ updatedAt: -1 });

    // Convert to plain objects
    const plainCases = cases.map(caseDoc => ({
      id: caseDoc._id.toString(),
      caseNumber: caseDoc.caseNumber,
      title: caseDoc.title,
      description: caseDoc.description,
      status: caseDoc.status,
      createdAt: caseDoc.createdAt?.toISOString(),
      updatedAt: caseDoc.updatedAt?.toISOString(),
      clientId: caseDoc.clientId?._id?.toString() || caseDoc.clientId,
      staffId: caseDoc.staffId?._id?.toString() || caseDoc.staffId
    }));

    return NextResponse.json(plainCases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

// POST /api/cases - Create a new case
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { caseNumber, title, description, status, clientId, staffId } = body;

    // Validate required fields
    if (!caseNumber || !title || !description || !clientId || !staffId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if case number already exists
    const existingCase = await CaseModel.findOne({ caseNumber });
    if (existingCase) {
      return NextResponse.json(
        { error: 'Case number already exists' },
        { status: 400 }
      );
    }

    // Verify client and staff exist
    const client = await UserModel.findById(clientId);
    const staff = await UserModel.findById(staffId);

    if (!client || !staff) {
      return NextResponse.json(
        { error: 'Client or staff not found' },
        { status: 404 }
      );
    }

    const newCase = new CaseModel({
      caseNumber,
      title,
      description,
      status: status || 'Open',
      clientId,
      staffId
    });

    await newCase.save();

    // Populate the response
    const populatedCase = await CaseModel.findById(newCase._id)
      .populate('clientId', 'name email')
      .populate('staffId', 'name email');

    // Convert to plain object
    const plainCase = {
      id: populatedCase._id.toString(),
      caseNumber: populatedCase.caseNumber,
      title: populatedCase.title,
      description: populatedCase.description,
      status: populatedCase.status,
      createdAt: populatedCase.createdAt?.toISOString(),
      updatedAt: populatedCase.updatedAt?.toISOString(),
      clientId: populatedCase.clientId?._id?.toString() || populatedCase.clientId,
      staffId: populatedCase.staffId?._id?.toString() || populatedCase.staffId
    };

    return NextResponse.json(plainCase, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
