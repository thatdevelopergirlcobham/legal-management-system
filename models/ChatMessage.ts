import mongoose, { Schema } from 'mongoose';

interface IChatMessage {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Ensure mongoose is connected before accessing models
let ChatMessageModel: mongoose.Model<IChatMessage>;
try {
  ChatMessageModel = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
} catch {
  // If models is not available, create the model directly
  ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
}

export default ChatMessageModel;
export type { IChatMessage };
