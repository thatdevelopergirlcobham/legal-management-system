import mongoose, { Schema } from 'mongoose';

interface ICase {
  caseNumber: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  clientId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const caseSchema = new Schema<ICase>(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open'
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
    }
  },
  { timestamps: true }
);

// Ensure mongoose is connected before accessing models
let CaseModel: mongoose.Model<ICase>;
try {
  CaseModel = mongoose.models.Case || mongoose.model<ICase>('Case', caseSchema);
} catch (error) {
  // If models is not available, create the model directly
  CaseModel = mongoose.model<ICase>('Case', caseSchema);
}

export default CaseModel;
export type { ICase };
