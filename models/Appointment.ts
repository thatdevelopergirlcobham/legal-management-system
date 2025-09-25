import mongoose, { Schema } from 'mongoose';

interface IAppointment {
  title: string;
  description: string;
  date: Date;
  duration: number; // in minutes
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  clientId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  caseId?: mongoose.Types.ObjectId;
  location?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 15 // minimum 15 minutes
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled'
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case'
    },
    location: {
      type: String
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

// Ensure mongoose is connected before accessing models
let AppointmentModel: mongoose.Model<IAppointment>;
try {
  AppointmentModel = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema);
} catch {
  // If models is not available, create the model directly
  AppointmentModel = mongoose.model<IAppointment>('Appointment', appointmentSchema);
}

export default AppointmentModel;
export type { IAppointment };
