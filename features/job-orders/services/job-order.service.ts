import { JobOrder } from "@/types";
import { mockJobOrders } from "@/lib/mock-data";

// In-memory store
let jobOrders: JobOrder[] = [...mockJobOrders];

export const jobOrderService = {
  // Get all job orders
  getAll: async (): Promise<JobOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...jobOrders];
  },

  // Get job orders by recruiter
  getByRecruiter: async (recruiterId: string): Promise<JobOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return jobOrders.filter((jo) => jo.assignedRecruiters.includes(recruiterId));
  },

  // Get job order by ID
  getById: async (id: string): Promise<JobOrder | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return jobOrders.find((jo) => jo.id === id) || null;
  },

  // Create job order
  create: async (data: Omit<JobOrder, "id" | "createdAt" | "updatedAt">): Promise<JobOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const newJobOrder: JobOrder = {
      ...data,
      id: `j${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    jobOrders.push(newJobOrder);
    return newJobOrder;
  },

  // Update job order
  update: async (id: string, data: Partial<JobOrder>): Promise<JobOrder | null> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const index = jobOrders.findIndex((jo) => jo.id === id);
    if (index === -1) return null;
    
    jobOrders[index] = {
      ...jobOrders[index],
      ...data,
      updatedAt: new Date(),
    };
    
    return jobOrders[index];
  },

  // Assign recruiters
  assignRecruiters: async (jobOrderId: string, recruiterIds: string[]): Promise<JobOrder | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = jobOrders.findIndex((jo) => jo.id === jobOrderId);
    if (index === -1) return null;
    
    jobOrders[index] = {
      ...jobOrders[index],
      assignedRecruiters: recruiterIds,
      updatedAt: new Date(),
    };
    
    return jobOrders[index];
  },

  // Delete job order
  delete: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = jobOrders.findIndex((jo) => jo.id === id);
    if (index === -1) return false;
    
    jobOrders.splice(index, 1);
    return true;
  },
};
