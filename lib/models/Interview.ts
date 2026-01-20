import mongoose, { Schema, Model } from "mongoose";

/**
 * Interview Model
 * 
 * Represents scheduled interviews for candidates.
 * Supports multi-level interview process (L1-L4).
 */

export enum InterviewLevel {
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  L4 = "L4",
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
}

export interface IInterview {
  candidateId: mongoose.Types.ObjectId;
  jobOrderId: mongoose.Types.ObjectId;
  level: InterviewLevel;
  scheduledAt: Date;
  status: InterviewStatus;
  feedback?: string;
  interviewerName?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "Candidate ID is required"],
      index: true,
    },
    jobOrderId: {
      type: Schema.Types.ObjectId,
      ref: "JobOrder",
      required: [true, "Job Order ID is required"],
      index: true,
    },
    level: {
      type: String,
      enum: Object.values(InterviewLevel),
      required: [true, "Interview level is required"],
    },
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled date is required"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.SCHEDULED,
      required: true,
      index: true,
    },
    feedback: {
      type: String,
    },
    interviewerName: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
InterviewSchema.index({ candidateId: 1, level: 1 });
InterviewSchema.index({ scheduledAt: 1, status: 1 });

// Prevent model recompilation in development
const Interview: Model<IInterview> =
  mongoose.models.Interview ||
  mongoose.model<IInterview>("Interview", InterviewSchema);

export default Interview;
