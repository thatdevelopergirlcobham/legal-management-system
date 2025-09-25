import { NextResponse } from 'next/server';
import { getAllUsers, getAllCases, getAllAppointments, getAllDocuments, getAllChatMessages } from '@/lib/mockData';

export async function GET() {
  try {
    const users = await getAllUsers();
    const cases = await getAllCases();
    const appointments = await getAllAppointments();
    const documents = await getAllDocuments();
    const messages = await getAllChatMessages();

    return NextResponse.json({
      message: 'Mock data system is working!',
      timestamp: new Date().toISOString(),
      data: {
        users: users.length,
        cases: cases.length,
        appointments: appointments.length,
        documents: documents.length,
        messages: messages.length
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'System error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
