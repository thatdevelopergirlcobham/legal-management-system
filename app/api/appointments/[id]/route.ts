import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AppointmentModel from '@/models/Appointment';
import UserModel from '@/models/User';
import CaseModel from '@/models/Case';

// GET /api/appointments/[id] - Get a specific appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const appointment = await AppointmentModel.findById(params.id)
      .populate('clientId', 'name email')
      .populate('staffId', 'name email')
      .populate('caseId', 'caseNumber title');

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id] - Update an appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { title, description, date, duration, status, clientId, staffId, caseId, location, notes } = body;

    // Check if appointment exists
    const existingAppointment = await AppointmentModel.findById(params.id);
    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
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

    // Check for scheduling conflicts if date, duration, or staff is being changed
    if ((date || duration || staffId) && status !== 'Cancelled') {
      const appointmentDate = new Date(date || existingAppointment.date);
      const appointmentDuration = duration || existingAppointment.duration;
      const appointmentStaffId = staffId || existingAppointment.staffId;

      const conflictingAppointment = await AppointmentModel.findOne({
        _id: { $ne: params.id },
        staffId: appointmentStaffId,
        date: {
          $gte: new Date(appointmentDate.getTime() - appointmentDuration * 60000),
          $lt: new Date(appointmentDate.getTime() + appointmentDuration * 60000)
        },
        status: { $ne: 'Cancelled' }
      });

      if (conflictingAppointment) {
        return NextResponse.json(
          { error: 'Scheduling conflict: Staff member has another appointment at this time' },
          { status: 400 }
        );
      }
    }

    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(duration && { duration }),
        ...(status && { status }),
        ...(clientId && { clientId }),
        ...(staffId && { staffId }),
        ...(caseId && { caseId }),
        ...(location !== undefined && { location }),
        ...(notes !== undefined && { notes })
      },
      { new: true, runValidators: true }
    )
      .populate('clientId', 'name email')
      .populate('staffId', 'name email')
      .populate('caseId', 'caseNumber title');

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id] - Delete an appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const deletedAppointment = await AppointmentModel.findByIdAndDelete(params.id);

    if (!deletedAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
