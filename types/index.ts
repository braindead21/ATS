import { UserRole, CandidateStatus, InterviewLevel, InterviewStatus, InterviewOutcome, JobOrderStatus, CompanyStatus, OfferStatus } from "@/lib/constants/enums";

// Re-export enums for convenience
export { UserRole, CandidateStatus, InterviewLevel, InterviewStatus, InterviewOutcome, JobOrderStatus, CompanyStatus, OfferStatus };

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
  createdBy: string | User;
  createdAt: Date;
  updatedAt: Date;
}

// Job Order
export interface JobOrder {
  id: string;
  companyId: string;
  title: string;
  description?: string;
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
  outcome?: InterviewOutcome;
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
  joiningBonus?: number;
  benefits?: string;
  offerNotes?: string;
  status: OfferStatus;
  offeredAt: Date;
  respondedAt?: Date;
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
