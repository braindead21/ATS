import mongoose, { Schema, Model } from "mongoose";

/**
 * Offer Model
 * 
 * Represents job offers made to candidates.
 * Tracks offer acceptance/rejection and joining details.
 */

export enum OfferStatus {
  OFFERED = "OFFERED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface IOffer {
  candidateId: mongoose.Types.ObjectId;
  jobOrderId: mongoose.Types.ObjectId;
  offeredRole: string;
  offeredSalary: string;
  expectedJoiningDate: Date;
  offerNotes?: string;
  status: OfferStatus;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "Candidate ID is required"],
      index: true,
      unique: true, // One offer per candidate
    },
    jobOrderId: {
      type: Schema.Types.ObjectId,
      ref: "JobOrder",
      required: [true, "Job Order ID is required"],
      index: true,
    },
    offeredRole: {
      type: String,
      required: [true, "Offered role is required"],
      trim: true,
    },
    offeredSalary: {
      type: String,
      required: [true, "Offered salary is required"],
      trim: true,
    },
    expectedJoiningDate: {
      type: Date,
      required: [true, "Expected joining date is required"],
    },
    offerNotes: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(OfferStatus),
      default: OfferStatus.OFFERED,
      required: true,
      index: true,
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
OfferSchema.index({ status: 1, createdAt: -1 });

// Prevent model recompilation in development
const Offer: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
