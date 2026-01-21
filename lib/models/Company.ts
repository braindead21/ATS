import mongoose, { Schema, Model } from "mongoose";

/**
 * Company Model
 * 
 * Represents client companies for which job orders are created.
 */

export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ICompany {
  name: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  faxNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  webSite?: string;
  departments?: string;
  keyTechnologies?: string;
  miscNotes?: string;
  isHotCompany?: boolean;
  industry?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: CompanyStatus;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      index: true,
    },
    primaryPhone: {
      type: String,
      trim: true,
    },
    secondaryPhone: {
      type: String,
      trim: true,
    },
    faxNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    webSite: {
      type: String,
      trim: true,
    },
    departments: {
      type: String,
      trim: true,
    },
    keyTechnologies: {
      type: String,
      trim: true,
    },
    miscNotes: {
      type: String,
      trim: true,
    },
    isHotCompany: {
      type: Boolean,
      default: false,
    },
    industry: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(CompanyStatus),
      default: CompanyStatus.ACTIVE,
      required: true,
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

// Prevent model recompilation in development
const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
