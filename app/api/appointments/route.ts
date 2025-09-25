import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AppointmentModel from '@/models/Appointment';
import UserModel from '@/models/User';
import CaseModel from '@/models/Case';

// GET /api/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const staffId = searchParams.get('staffId');
    const caseId = searchParams.get('caseId');
    const date = searchParams.get('date');

    const filter: { status?: string; clientId?: string; staffId?: string; caseId?: string; date?: { $gte: Date; $lt: Date } } = {};
    if (status) filter.status = status;
    if (clientId) filter.clientId = clientId;
    if (staffId) filter.staffId = staffId;
    if (caseId) filter.caseId = caseId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await AppointmentModel.find(filter)
      .populate('clientId', 'name email')
      .populate('staffId', 'name email')
      .populate('caseId', 'caseNumber title')
      .sort({ date: 1 });

    // Convert to plain objects
    const plainAppointments = appointments.map(apt => ({
      id: apt._id.toString(),
      title: apt.title,
      description: apt.description,
      date: apt.date?.toISOString(),
      duration: apt.duration,
      status: apt.status,
      clientId: apt.clientId?._id?.toString() || apt.clientId,
      staffId: apt.staffId?._id?.toString() || apt.staffId,
      caseId: apt.caseId?._id?.toString() || apt.caseId,
      location: apt.location,
      notes: apt.notes,
      createdAt: apt.createdAt?.toISOString(),
      updatedAt: apt.updatedAt?.toISOString()
    }));

    return NextResponse.json(plainAppointments);
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
    await connectToDatabase();

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
    const client = await UserModel.findById(clientId);
    const staff = await UserModel.findById(staffId);

    if (!client || !staff) {
      return NextResponse.json(
        { error: 'Client or staff not found' },
        { status: 404 }
      );
    }

    // Verify case exists if provided
    if (caseId) {
      const caseDoc = await CaseModel.findById(caseId);
      if (!caseDoc) {
        return NextResponse.json(
          { error: 'Case not found' },
          { status: 404 }
        );
      }
    }

    // Check for scheduling conflicts
    const appointmentDate = new Date(date);
    const existingAppointment = await AppointmentModel.findOne({
      staffId,
      date: {
        $gte: new Date(appointmentDate.getTime() - duration * 60000),
        $lt: new Date(appointmentDate.getTime() + duration * 60000)
      },
      status: { $ne: 'Cancelled' }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Scheduling conflict: Staff member has another appointment at this time' },
        { status: 400 }
      );
    }

    const newAppointment = new AppointmentModel({
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

    await newAppointment.save();

    // Populate the response
    const populatedAppointment = await AppointmentModel.findById(newAppointment._id)
      .populate('clientId', 'name email')
      .populate('staffId', 'name email')
      .populate('caseId', 'caseNumber title');

    // Convert to plain object
    const plainAppointment = {
      id: populatedAppointment._id.toString(),
      title: populatedAppointment.title,
      description: populatedAppointment.description,
      date: populatedAppointment.date?.toISOString(),
      duration: populatedAppointment.duration,
      status: populatedAppointment.status,
      clientId: populatedAppointment.clientId?._id?.toString() || populatedAppointment.clientId,
      staffId: populatedAppointment.staffId?._id?.toString() || populatedAppointment.staffId,
      caseId: populatedAppointment.caseId?._id?.toString() || populatedAppointment.caseId,
      location: populatedAppointment.location,
      notes: populatedAppointment.notes,
      createdAt: populatedAppointment.createdAt?.toISOString(),
      updatedAt: populatedAppointment.updatedAt?.toISOString()
    };

    return NextResponse.json(plainAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
