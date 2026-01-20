import { UserRole, CandidateStatus, InterviewLevel, InterviewStatus, JobOrderStatus, CompanyStatus, OfferStatus } from "@/lib/constants/enums";

// Re-export enums for convenience
export { UserRole, CandidateStatus, InterviewLevel, InterviewStatus, JobOrderStatus, CompanyStatus, OfferStatus };

// User
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Company
export interface Company {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: CompanyStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Job Order
export interface JobOrder {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  salaryRange?: string;
  positions: number;
  status: JobOrderStatus;
  createdBy: string;
  assignedRecruiters: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Candidate
export interface Candidate {
  id: string;
  jobOrderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  status: CandidateStatus;
  currentLevel?: InterviewLevel;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interview
export interface Interview {
  id: string;
  candidateId: string;
  jobOrderId: string;
  level: InterviewLevel;
  scheduledAt: Date;
  status: InterviewStatus;
  feedback?: string;
  interviewerName?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Offer
export interface Offer {
  id: string;
  candidateId: string;
  jobOrderId: string;
  offeredRole: string;
  offeredSalary: string;
  expectedJoiningDate: Date;
  offerNotes?: string;
  status: OfferStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Log (for audit trail)
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}
