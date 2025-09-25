import { NextRequest, NextResponse } from 'next/server';
import { getAllDocuments, createDocument, findCaseById, findUserById } from '@/lib/mockData';

// GET /api/documents - Get all documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');
    const uploadedBy = searchParams.get('uploadedBy');

    let documents = await getAllDocuments();

    // Apply filters
    if (caseId) documents = documents.filter(d => d.caseId === caseId);
    if (uploadedBy) documents = documents.filter(d => d.uploadedBy === uploadedBy);

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Upload a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, originalName, filePath, fileSize, mimeType, caseId, uploadedBy } = body;

    // Validate required fields
    if (!name || !originalName || !filePath || !fileSize || !mimeType || !caseId || !uploadedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify case exists
    const caseDoc = await findCaseById(caseId);
    if (!caseDoc) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Verify user exists
    const user = await findUserById(uploadedBy);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const newDocument = await createDocument({
      name,
      originalName,
      filePath,
      fileSize,
      mimeType,
      caseId,
      uploadedBy,
      uploadedAt: new Date()
    });

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
