import { JobOrder } from "@/types";
import { jobOrdersApi } from "@/lib/api";

export const jobOrderService = {
  // Get all job orders
  getAll: async (): Promise<JobOrder[]> => {
    const response = await jobOrdersApi.getJobOrders();
    return response.map((jo) => ({
      id: jo.id,
      companyId: jo.companyId,
      title: jo.title,
      description: jo.description,
      requirements: jo.requirements,
      location: jo.location,
      salaryRange: jo.salaryRange,
      positions: jo.positions,
      status: jo.status as any,
      createdBy: jo.createdBy,
      assignedRecruiters: jo.assignedRecruiters,
      createdAt: new Date(jo.createdAt),
      updatedAt: new Date(jo.updatedAt),
    }));
  },

  // Get job orders by recruiter
  getByRecruiter: async (recruiterId: string): Promise<JobOrder[]> => {
    const allJobOrders = await jobOrderService.getAll();
    return allJobOrders.filter((jo) => 
      jo.assignedRecruiters.some((r: any) => 
        typeof r === 'string' ? r === recruiterId : r.id === recruiterId
      )
    );
  },

  // Get job order by ID
  getById: async (id: string): Promise<JobOrder | null> => {
    try {
      const response = await jobOrdersApi.getJobOrder(id);
      return {
        id: response.id,
        companyId: response.companyId,
        title: response.title,
        description: response.description,
        requirements: response.requirements,
        location: response.location,
        salaryRange: response.salaryRange,
        positions: response.positions,
        status: response.status as any,
        createdBy: response.createdBy,
        assignedRecruiters: response.assignedRecruiters,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  // Create job order
  create: async (data: Omit<JobOrder, "id" | "createdAt" | "updatedAt">): Promise<JobOrder> => {
    const response = await jobOrdersApi.createJobOrder({
      companyId: typeof data.companyId === 'string' ? data.companyId : (data.companyId as any).id,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      salaryRange: data.salaryRange,
      positions: data.positions,
      status: data.status,
      createdBy: typeof data.createdBy === 'string' ? data.createdBy : (data.createdBy as any).id,
      assignedRecruiters: data.assignedRecruiters.map((r: any) => 
        typeof r === 'string' ? r : r.id
      ),
    });

    return {
      id: response.id,
      companyId: response.companyId,
      title: response.title,
      description: response.description,
      requirements: response.requirements,
      location: response.location,
      salaryRange: response.salaryRange,
      positions: response.positions,
      status: response.status as any,
      createdBy: response.createdBy,
      assignedRecruiters: response.assignedRecruiters,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  },

  // Update job order
  update: async (id: string, data: Partial<JobOrder>): Promise<JobOrder | null> => {
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.requirements !== undefined) updateData.requirements = data.requirements;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.salaryRange !== undefined) updateData.salaryRange = data.salaryRange;
      if (data.positions !== undefined) updateData.positions = data.positions;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.assignedRecruiters !== undefined) {
        updateData.assignedRecruiters = data.assignedRecruiters.map((r: any) => 
          typeof r === 'string' ? r : r.id
        );
      }

      const response = await jobOrdersApi.updateJobOrder(id, updateData);

      return {
        id: response.id,
        companyId: response.companyId,
        title: response.title,
        description: response.description,
        requirements: response.requirements,
        location: response.location,
        salaryRange: response.salaryRange,
        positions: response.positions,
        status: response.status as any,
        createdBy: response.createdBy,
        assignedRecruiters: response.assignedRecruiters,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  // Assign recruiters
  assignRecruiters: async (jobOrderId: string, recruiterIds: string[]): Promise<JobOrder | null> => {
    return jobOrderService.update(jobOrderId, { assignedRecruiters: recruiterIds as any });
  },

  // Delete job order
  delete: async (id: string): Promise<boolean> => {
    try {
      await jobOrdersApi.deleteJobOrder(id);
      return true;
    } catch (error) {
      return false;
    }
  },
};
