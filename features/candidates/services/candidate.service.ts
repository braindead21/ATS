import { Candidate } from "@/types";
import { CandidateStatus } from "@/lib/constants/enums";
import { candidatesApi } from "@/lib/api";

export const candidateService = {
  // Get all candidates
  getAll: async (): Promise<Candidate[]> => {
    const response = await candidatesApi.getCandidates();
    return response.map((c) => ({
      id: c.id,
      jobOrderId: c.jobOrderId,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      resumeUrl: c.resumeUrl,
      linkedinUrl: c.linkedinUrl,
      status: c.status as any,
      currentLevel: c.currentLevel as any,
      addedBy: c.addedBy,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    }));
  },

  // Get candidates by job order
  getByJobOrder: async (jobOrderId: string): Promise<Candidate[]> => {
    const response = await candidatesApi.getCandidates(jobOrderId);
    return response.map((c) => ({
      id: c.id,
      jobOrderId: c.jobOrderId,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      resumeUrl: c.resumeUrl,
      linkedinUrl: c.linkedinUrl,
      status: c.status as any,
      currentLevel: c.currentLevel as any,
      addedBy: c.addedBy,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    }));
  },

  // Get candidate by ID
  getById: async (id: string): Promise<Candidate | null> => {
    try {
      const response = await candidatesApi.getCandidate(id);
      return {
        id: response.id,
        jobOrderId: response.jobOrderId,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone,
        resumeUrl: response.resumeUrl,
        linkedinUrl: response.linkedinUrl,
        status: response.status as any,
        currentLevel: response.currentLevel as any,
        addedBy: response.addedBy,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  // Create candidate
  create: async (data: Omit<Candidate, "id" | "createdAt" | "updatedAt">): Promise<Candidate> => {
    const response = await candidatesApi.createCandidate({
      jobOrderId: typeof data.jobOrderId === 'string' ? data.jobOrderId : (data.jobOrderId as any).id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      resumeUrl: data.resumeUrl,
      linkedinUrl: data.linkedinUrl,
      status: data.status || CandidateStatus.NO_CONTACT,
      currentLevel: data.currentLevel,
      addedBy: typeof data.addedBy === 'string' ? data.addedBy : (data.addedBy as any).id,
    });

    return {
      id: response.id,
      jobOrderId: response.jobOrderId,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      phone: response.phone,
      resumeUrl: response.resumeUrl,
      linkedinUrl: response.linkedinUrl,
      status: response.status as any,
      currentLevel: response.currentLevel as any,
      addedBy: response.addedBy,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  },

  // Update candidate
  update: async (id: string, data: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const updateData: any = {};
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.resumeUrl !== undefined) updateData.resumeUrl = data.resumeUrl;
      if (data.linkedinUrl !== undefined) updateData.linkedinUrl = data.linkedinUrl;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.currentLevel !== undefined) updateData.currentLevel = data.currentLevel;

      const response = await candidatesApi.updateCandidate(id, updateData);

      return {
        id: response.id,
        jobOrderId: response.jobOrderId,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone,
        resumeUrl: response.resumeUrl,
        linkedinUrl: response.linkedinUrl,
        status: response.status as any,
        currentLevel: response.currentLevel as any,
        addedBy: response.addedBy,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  // Update candidate status
  updateStatus: async (id: string, status: CandidateStatus): Promise<Candidate | null> => {
    return candidateService.update(id, { status });
  },

  // Delete candidate
  delete: async (id: string): Promise<boolean> => {
    try {
      await candidatesApi.deleteCandidate(id);
      return true;
    } catch (error) {
      return false;
    }
  },
};
