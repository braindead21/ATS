import { Candidate } from "@/types";
import { CandidateStatus } from "@/lib/constants/enums";
import { mockCandidates } from "@/lib/mock-data";

// In-memory store
let candidates: Candidate[] = [...mockCandidates];

export const candidateService = {
  // Get all candidates
  getAll: async (): Promise<Candidate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...candidates];
  },

  // Get candidates by job order
  getByJobOrder: async (jobOrderId: string): Promise<Candidate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return candidates.filter((c) => c.jobOrderId === jobOrderId);
  },

  // Get candidate by ID
  getById: async (id: string): Promise<Candidate | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return candidates.find((c) => c.id === id) || null;
  },

  // Create candidate
  create: async (data: Omit<Candidate, "id" | "createdAt" | "updatedAt">): Promise<Candidate> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const newCandidate: Candidate = {
      ...data,
      id: `cand${Date.now()}`,
      status: CandidateStatus.NO_CONTACT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    candidates.push(newCandidate);
    return newCandidate;
  },

  // Update candidate
  update: async (id: string, data: Partial<Candidate>): Promise<Candidate | null> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const index = candidates.findIndex((c) => c.id === id);
    if (index === -1) return null;
    
    candidates[index] = {
      ...candidates[index],
      ...data,
      updatedAt: new Date(),
    };
    
    return candidates[index];
  },

  // Update candidate status
  updateStatus: async (id: string, status: CandidateStatus): Promise<Candidate | null> => {
    return candidateService.update(id, { status });
  },

  // Delete candidate
  delete: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = candidates.findIndex((c) => c.id === id);
    if (index === -1) return false;
    
    candidates.splice(index, 1);
    return true;
  },
};
