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
  WITHDRAWN = "WITHDRAWN",
}

export interface IOffer {
  candidateId: mongoose.Types.ObjectId;
  jobOrderId: mongoose.Types.ObjectId;
  offeredRole: string;
  offeredSalary: string;
  expectedJoiningDate: Date;
  joiningBonus?: number;
  benefits?: string;
  offerNotes?: string;
  status: OfferStatus;
  offeredAt: Date;
  respondedAt?: Date;
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
    joiningBonus: {
      type: Number,
    },
    benefits: {
      type: String,
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
    offeredAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    respondedAt: {
      type: Date,
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
OfferSchema.index({ candidateId: 1, status: 1 });
OfferSchema.index({ offeredAt: 1 });

// Prevent model recompilation in development
const Offer: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
