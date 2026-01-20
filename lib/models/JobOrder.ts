import mongoose, { Schema, Model } from "mongoose";

/**
 * JobOrder Model
 * 
 * Represents job requisitions from companies.
 * Can be assigned to multiple recruiters.
 */

export enum JobOrderStatus {
  OPEN = "OPEN",
  ON_HOLD = "ON_HOLD",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export interface IJobOrder {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  salaryRange?: string;
  positions: number;
  status: JobOrderStatus;
  createdBy: mongoose.Types.ObjectId;
  assignedRecruiters: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const JobOrderSchema = new Schema<IJobOrder>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    salaryRange: {
      type: String,
      trim: true,
    },
    positions: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(JobOrderStatus),
      default: JobOrderStatus.OPEN,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedRecruiters: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
JobOrderSchema.index({ status: 1, createdAt: -1 });
JobOrderSchema.index({ assignedRecruiters: 1 });

// Prevent model recompilation in development
const JobOrder: Model<IJobOrder> =
  mongoose.models.JobOrder ||
  mongoose.model<IJobOrder>("JobOrder", JobOrderSchema);

export default JobOrder;
