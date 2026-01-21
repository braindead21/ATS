// User Roles
export enum UserRole {
  ADMIN = "ADMIN",
  LEADER = "LEADER",
  RECRUITER = "RECRUITER",
}

// Candidate Status
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

// Interview Levels
export enum InterviewLevel {
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  L4 = "L4",
}

// Interview Status
export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Interview Outcome
export enum InterviewOutcome {
  HIRED = "HIRED",
  REJECTED = "REJECTED",
  NEXT_INTERVIEW = "NEXT_INTERVIEW",
  ON_HOLD = "ON_HOLD",
}

// Job Order Status
export enum JobOrderStatus {
  OPEN = "OPEN",
  ON_HOLD = "ON_HOLD",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

// Company Status
export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// Offer Status
export enum OfferStatus {
  OFFERED = "OFFERED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  WITHDRAWN = "WITHDRAWN",
}
