import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, object, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['ADMIN', 'STAFF', 'CLIENT'],
      required: true
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Ensure mongoose is connected before accessing models
let UserModel: UserModel;
try {
  UserModel = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);
} catch {
  // If models is not available, create the model directly
  UserModel = mongoose.model<IUser, UserModel>('User', userSchema);
}

export default UserModel;
export type { IUser, UserModel, IUserMethods };
