import { NextRequest, NextResponse } from 'next/server';
import { getAllAppointments, createAppointment, findUserById, findCaseById } from '@/lib/mockData';

// GET /api/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const staffId = searchParams.get('staffId');
    const caseId = searchParams.get('caseId');
    const date = searchParams.get('date');

    let appointments = await getAllAppointments();

    // Apply filters
    if (status) appointments = appointments.filter(a => a.status === status);
    if (clientId) appointments = appointments.filter(a => a.clientId === clientId);
    if (staffId) appointments = appointments.filter(a => a.staffId === staffId);
    if (caseId) appointments = appointments.filter(a => a.caseId === caseId);
    if (date) {
      const filterDate = new Date(date);
      appointments = appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate.toDateString() === filterDate.toDateString();
      });
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, duration, status, clientId, staffId, caseId, location, notes } = body;

    // Validate required fields
    if (!title || !description || !date || !duration || !clientId || !staffId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify client and staff exist
    const client = await findUserById(clientId);
    const staff = await findUserById(staffId);

    if (!client || !staff) {
      return NextResponse.json(
        { error: 'Client or staff not found' },
        { status: 404 }
      );
    }

    // Verify case exists if provided
    if (caseId) {
      const caseDoc = await findCaseById(caseId);
      if (!caseDoc) {
        return NextResponse.json(
          { error: 'Case not found' },
          { status: 404 }
        );
      }
    }

    // Check for scheduling conflicts
    const appointmentDate = new Date(date);
    const allAppointments = await getAllAppointments();
    const existingAppointment = allAppointments.find(apt => {
      const aptDate = new Date(apt.date);
      const aptStart = aptDate.getTime();
      const aptEnd = aptStart + apt.duration * 60000;
      const newStart = appointmentDate.getTime();
      const newEnd = newStart + duration * 60000;

      return apt.staffId === staffId &&
             apt.status !== 'Cancelled' &&
             ((newStart >= aptStart && newStart < aptEnd) ||
              (newEnd > aptStart && newEnd <= aptEnd) ||
              (newStart <= aptStart && newEnd >= aptEnd));
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Scheduling conflict: Staff member has another appointment at this time' },
        { status: 400 }
      );
    }

    const newAppointment = await createAppointment({
      title,
      description,
      date: appointmentDate,
      duration,
      status: status || 'Scheduled',
      clientId,
      staffId,
      caseId,
      location,
      notes
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
