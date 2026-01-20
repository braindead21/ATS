/**
 * Model Index
 * 
 * Central export point for all Mongoose models.
 */

export { default as User } from "./User";
export { default as Company } from "./Company";
export { default as JobOrder } from "./JobOrder";
export { default as Candidate } from "./Candidate";
export { default as Interview } from "./Interview";
export { default as Offer } from "./Offer";

// Re-export types for convenience
export type { IUser } from "./User";
export type { ICompany } from "./Company";
export type { IJobOrder } from "./JobOrder";
export type { ICandidate } from "./Candidate";
export type { IInterview } from "./Interview";
export type { IOffer } from "./Offer";

// Re-export enums
export { UserRole } from "./User";
export { CompanyStatus } from "./Company";
export { JobOrderStatus } from "./JobOrder";
export { CandidateStatus, InterviewLevel as CandidateInterviewLevel } from "./Candidate";
export { InterviewLevel, InterviewStatus } from "./Interview";
export { OfferStatus } from "./Offer";
