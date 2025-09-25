import { NextRequest, NextResponse } from 'next/server';
import { findAppointmentById, updateAppointment, deleteAppointment, getAllAppointments, findUserById, findCaseById } from '@/lib/mockData';

// GET /api/appointments/[id] - Get a specific appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await findAppointmentById(params.id);

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
    const body = await request.json();
    const { title, description, date, duration, status, clientId, staffId, caseId, location, notes } = body;

    // Check if appointment exists
    const existingAppointment = await findAppointmentById(params.id);
    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
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

    // Check for scheduling conflicts if date, duration, or staff is being changed
    if ((date || duration || staffId) && status !== 'Cancelled') {
      const appointmentDate = new Date(date || existingAppointment.date);
      const appointmentDuration = duration || existingAppointment.duration;
      const appointmentStaffId = staffId || existingAppointment.staffId;

      const allAppointments = await getAllAppointments();
      const conflictingAppointment = allAppointments.find(apt => {
        if (apt._id === params.id) return false;

        const aptDate = new Date(apt.date);
        const aptStart = aptDate.getTime();
        const aptEnd = aptStart + apt.duration * 60000;
        const newStart = appointmentDate.getTime();
        const newEnd = newStart + appointmentDuration * 60000;

        return apt.staffId === appointmentStaffId &&
               apt.status !== 'Cancelled' &&
               ((newStart >= aptStart && newStart < aptEnd) ||
                (newEnd > aptStart && newEnd <= aptEnd) ||
                (newStart <= aptStart && newEnd >= aptEnd));
      });

      if (conflictingAppointment) {
        return NextResponse.json(
          { error: 'Scheduling conflict: Staff member has another appointment at this time' },
          { status: 400 }
        );
      }
    }

    const updatedAppointment = await updateAppointment(params.id, {
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
    });

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
    const deleted = await deleteAppointment(params.id);

    if (!deleted) {
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
