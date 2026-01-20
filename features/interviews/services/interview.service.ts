import { Interview, InterviewStatus, InterviewLevel } from "@/types";
import { interviewsApi } from "@/lib/api";

export const interviewService = {
  async getAll(): Promise<Interview[]> {
    const response = await interviewsApi.getInterviews();
    return response.map((iv) => ({
      id: iv.id,
      candidateId: iv.candidateId,
      jobOrderId: iv.jobOrderId,
      level: iv.level as any,
      scheduledAt: new Date(iv.scheduledAt),
      status: iv.status as any,
      feedback: iv.feedback,
      interviewerName: iv.interviewerName,
      createdBy: iv.createdBy,
      createdAt: new Date(iv.createdAt),
      updatedAt: new Date(iv.updatedAt),
    }));
  },

  async getByCandidate(candidateId: string): Promise<Interview[]> {
    const response = await interviewsApi.getInterviews(candidateId);
    return response.map((iv) => ({
      id: iv.id,
      candidateId: iv.candidateId,
      jobOrderId: iv.jobOrderId,
      level: iv.level as any,
      scheduledAt: new Date(iv.scheduledAt),
      status: iv.status as any,
      feedback: iv.feedback,
      interviewerName: iv.interviewerName,
      createdBy: iv.createdBy,
      createdAt: new Date(iv.createdAt),
      updatedAt: new Date(iv.updatedAt),
    }));
  },

  async getByJobOrder(jobOrderId: string): Promise<Interview[]> {
    const allInterviews = await interviewService.getAll();
    return allInterviews.filter((iv) => 
      typeof iv.jobOrderId === 'string' ? iv.jobOrderId === jobOrderId : (iv.jobOrderId as any).id === jobOrderId
    );
  },

  async getById(id: string): Promise<Interview | null> {
    try {
      const response = await interviewsApi.getInterview(id);
      return {
        id: response.id,
        candidateId: response.candidateId,
        jobOrderId: response.jobOrderId,
        level: response.level as any,
        scheduledAt: new Date(response.scheduledAt),
        status: response.status as any,
        feedback: response.feedback,
        interviewerName: response.interviewerName,
        createdBy: response.createdBy,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  async create(
    data: Omit<Interview, "id" | "createdAt" | "updatedAt">
  ): Promise<Interview> {
    const response = await interviewsApi.createInterview({
      candidateId: typeof data.candidateId === 'string' ? data.candidateId : (data.candidateId as any).id,
      jobOrderId: typeof data.jobOrderId === 'string' ? data.jobOrderId : (data.jobOrderId as any).id,
      level: data.level,
      scheduledAt: data.scheduledAt.toISOString(),
      status: data.status,
      feedback: data.feedback,
      interviewerName: data.interviewerName,
      createdBy: typeof data.createdBy === 'string' ? data.createdBy : (data.createdBy as any).id,
    });

    return {
      id: response.id,
      candidateId: response.candidateId,
      jobOrderId: response.jobOrderId,
      level: response.level as any,
      scheduledAt: new Date(response.scheduledAt),
      status: response.status as any,
      feedback: response.feedback,
      interviewerName: response.interviewerName,
      createdBy: response.createdBy,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  },

  async update(
    id: string,
    data: Partial<Omit<Interview, "id" | "createdAt" | "updatedAt">>
  ): Promise<Interview | null> {
    try {
      const updateData: any = {};
      if (data.level !== undefined) updateData.level = data.level;
      if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt.toISOString();
      if (data.status !== undefined) updateData.status = data.status;
      if (data.feedback !== undefined) updateData.feedback = data.feedback;
      if (data.interviewerName !== undefined) updateData.interviewerName = data.interviewerName;

      const response = await interviewsApi.updateInterview(id, updateData);

      return {
        id: response.id,
        candidateId: response.candidateId,
        jobOrderId: response.jobOrderId,
        level: response.level as any,
        scheduledAt: new Date(response.scheduledAt),
        status: response.status as any,
        feedback: response.feedback,
        interviewerName: response.interviewerName,
        createdBy: response.createdBy,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  async markCompleted(
    id: string,
    feedback?: string
  ): Promise<Interview | null> {
    return interviewService.update(id, {
      status: InterviewStatus.COMPLETED,
      feedback,
    });
  },

  async delete(id: string): Promise<boolean> {
    try {
      await interviewsApi.deleteInterview(id);
      return true;
    } catch (error) {
      return false;
    }
  },
};
