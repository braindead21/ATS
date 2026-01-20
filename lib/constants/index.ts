import { UserRole } from "./enums";

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrator",
  [UserRole.LEADER]: "Leader",
  [UserRole.RECRUITER]: "Recruiter",
};

export const APP_NAME = "ATS System";
export const APP_VERSION = "1.0.0";
