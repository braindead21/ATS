import { Interview, InterviewStatus, InterviewLevel } from "@/types";
import { mockInterviews } from "@/lib/mock-data";

let interviews: Interview[] = [...mockInterviews];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const interviewService = {
  async getAll(): Promise<Interview[]> {
    await delay(300);
    return [...interviews];
  },

  async getByCandidate(candidateId: string): Promise<Interview[]> {
    await delay(300);
    return interviews.filter((iv) => iv.candidateId === candidateId);
  },

  async getByJobOrder(jobOrderId: string): Promise<Interview[]> {
    await delay(300);
    return interviews.filter((iv) => iv.jobOrderId === jobOrderId);
  },

  async getById(id: string): Promise<Interview | null> {
    await delay(300);
    return interviews.find((iv) => iv.id === id) || null;
  },

  async create(
    data: Omit<Interview, "id" | "createdAt" | "updatedAt">
  ): Promise<Interview> {
    await delay(400);
    const newInterview: Interview = {
      ...data,
      id: `iv${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    interviews.push(newInterview);
    return newInterview;
  },

  async update(
    id: string,
    data: Partial<Omit<Interview, "id" | "createdAt" | "updatedAt">>
  ): Promise<Interview | null> {
    await delay(400);
    const index = interviews.findIndex((iv) => iv.id === id);
    if (index === -1) return null;

    interviews[index] = {
      ...interviews[index],
      ...data,
      updatedAt: new Date(),
    };
    return interviews[index];
  },

  async markCompleted(
    id: string,
    feedback?: string
  ): Promise<Interview | null> {
    await delay(400);
    const index = interviews.findIndex((iv) => iv.id === id);
    if (index === -1) return null;

    interviews[index] = {
      ...interviews[index],
      status: InterviewStatus.COMPLETED,
      feedback,
      updatedAt: new Date(),
    };
    return interviews[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(400);
    const index = interviews.findIndex((iv) => iv.id === id);
    if (index === -1) return false;

    interviews.splice(index, 1);
    return true;
  },
};
