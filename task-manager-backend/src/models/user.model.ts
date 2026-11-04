import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserDoc } from '../types';

const UserSchema = new Schema<IUserDoc>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: function (this: IUserDoc) {
        return this.provider === 'local';
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      index: true,
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    columns: {
      type: [
        {
          key: { type: String, required: true },
          label: { type: String, required: true },
          color: { type: String, default: '' },
          bg: { type: String, default: '' },
          dot: { type: String, default: '' },
        },
      ],
      default: [
        {
          key: 'pending',
          label: 'Pending',
          color: 'text-amber-700 dark:text-amber-300',
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
        },
        {
          key: 'in_progress',
          label: 'In Progress',
          color: 'text-blue-700 dark:text-blue-300',
          bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
          dot: 'bg-blue-500',
        },
        {
          key: 'completed',
          label: 'Completed',
          color: 'text-emerald-700 dark:text-emerald-300',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: unknown) {
    next(err as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDoc>('User', UserSchema);
