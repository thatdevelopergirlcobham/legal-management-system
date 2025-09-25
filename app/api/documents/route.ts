import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import CaseModel from '@/models/Case';
import UserModel from '@/models/User';

// GET /api/documents - Get all documents
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');
    const uploadedBy = searchParams.get('uploadedBy');

    const filter: any = {};
    if (caseId) filter.caseId = caseId;
    if (uploadedBy) filter.uploadedBy = uploadedBy;

    const documents = await DocumentModel.find(filter)
      .populate('caseId', 'caseNumber title')
      .populate('uploadedBy', 'name email')
      .sort({ uploadedAt: -1 });

    // Convert to plain objects
    const plainDocuments = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      originalName: doc.originalName,
      filePath: doc.filePath,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      caseId: doc.caseId?._id?.toString() || doc.caseId,
      uploadedBy: doc.uploadedBy?._id?.toString() || doc.uploadedBy,
      uploadedAt: doc.uploadedAt?.toISOString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString()
    }));

    return NextResponse.json(plainDocuments);
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
    await connectToDatabase();

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
    const caseDoc = await CaseModel.findById(caseId);
    if (!caseDoc) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Verify user exists
    const user = await UserModel.findById(uploadedBy);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const newDocument = new DocumentModel({
      name,
      originalName,
      filePath,
      fileSize,
      mimeType,
      caseId,
      uploadedBy
    });

    await newDocument.save();

    // Populate the response
    const populatedDocument = await DocumentModel.findById(newDocument._id)
      .populate('caseId', 'caseNumber title')
      .populate('uploadedBy', 'name email');

    // Convert to plain object
    const plainDocument = {
      id: populatedDocument._id.toString(),
      name: populatedDocument.name,
      originalName: populatedDocument.originalName,
      filePath: populatedDocument.filePath,
      fileSize: populatedDocument.fileSize,
      mimeType: populatedDocument.mimeType,
      caseId: populatedDocument.caseId?._id?.toString() || populatedDocument.caseId,
      uploadedBy: populatedDocument.uploadedBy?._id?.toString() || populatedDocument.uploadedBy,
      uploadedAt: populatedDocument.uploadedAt?.toISOString(),
      createdAt: populatedDocument.createdAt?.toISOString(),
      updatedAt: populatedDocument.updatedAt?.toISOString()
    };

    return NextResponse.json(plainDocument, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
