import mongoose, { Schema, Model } from "mongoose";

/**
 * Candidate Model
 * 
 * Represents candidates applying for job orders.
 * Tracks candidate status through the recruitment pipeline.
 */

export enum CandidateStatus {
  NO_CONTACT = "NO_CONTACT",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  REJECTED = "REJECTED",
  ON_HOLD = "ON_HOLD",
  NEXT_INTERVIEW = "NEXT_INTERVIEW",
  HIRED = "HIRED",
  OFFERED = "OFFERED",
  OFFER_ACCEPTED = "OFFER_ACCEPTED",
  OFFER_DECLINED = "OFFER_DECLINED",
  JOINED = "JOINED",
  SUCCESSFUL_HIRE = "SUCCESSFUL_HIRE",
  BAD_DELIVERY = "BAD_DELIVERY",
  TERMINATED = "TERMINATED",
}

export enum InterviewLevel {
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  L4 = "L4",
}

export interface ICandidate {
  jobOrderId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  status: CandidateStatus;
  currentLevel?: InterviewLevel;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    jobOrderId: {
      type: Schema.Types.ObjectId,
      ref: "JobOrder",
      required: [true, "Job Order ID is required"],
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(CandidateStatus),
      default: CandidateStatus.NO_CONTACT,
      required: true,
      index: true,
    },
    currentLevel: {
      type: String,
      enum: Object.values(InterviewLevel),
    },
    addedBy: {
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
CandidateSchema.index({ jobOrderId: 1, status: 1 });
CandidateSchema.index({ email: 1, jobOrderId: 1 });

// Prevent model recompilation in development
const Candidate: Model<ICandidate> =
  mongoose.models.Candidate ||
  mongoose.model<ICandidate>("Candidate", CandidateSchema);

export default Candidate;
