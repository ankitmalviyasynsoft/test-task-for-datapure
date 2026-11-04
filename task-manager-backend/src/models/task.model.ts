import mongoose, { Schema } from 'mongoose';
import { ITaskDoc } from '../types';

const TaskSchema = new Schema<ITaskDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      required: [true, 'Task status is required'],
      trim: true,
      minlength: [1, 'Status cannot be empty'],
      maxlength: [50, 'Status cannot exceed 50 characters'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid task priority',
      },
      default: 'medium',
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for user querying & filtering
TaskSchema.index({ user: 1, status: 1, order: 1 });
TaskSchema.index({ user: 1, priority: 1 });
TaskSchema.index({ user: 1, dueDate: 1 });
TaskSchema.index({ user: 1, createdAt: -1 });
TaskSchema.index({ user: 1, title: 'text', description: 'text' });

export const Task = mongoose.model<ITaskDoc>('Task', TaskSchema);
