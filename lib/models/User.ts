import mongoose, { Schema, Model } from "mongoose";

/**
 * User Model
 * 
 * Represents system users with role-based access control.
 * Roles: Admin, Leader, Recruiter
 */

export enum UserRole {
  ADMIN = "ADMIN",
  LEADER = "LEADER",
  RECRUITER = "RECRUITER",
}

export interface IUser {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RECRUITER,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
