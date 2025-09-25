import mongoose, { Schema } from 'mongoose';

interface IDocument {
  name: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  caseId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    name: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Ensure mongoose is connected before accessing models
let DocumentModel: mongoose.Model<IDocument>;
try {
  DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);
} catch {
  // If models is not available, create the model directly
  DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
}

export default DocumentModel;
export type { IDocument };
