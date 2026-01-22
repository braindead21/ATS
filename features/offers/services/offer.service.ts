import { Offer, OfferStatus } from "@/types";
import { offersApi } from "@/lib/api";

export const offerService = {
  async getAll(): Promise<Offer[]> {
    const response = await offersApi.getOffers();
    return response.map((o) => ({
      id: o.id,
      candidateId: o.candidateId,
      jobOrderId: o.jobOrderId,
      offeredRole: o.offeredRole,
      offeredSalary: String(o.offeredSalary),
      expectedJoiningDate: new Date(o.expectedJoiningDate),
      joiningBonus: o.joiningBonus,
      benefits: o.benefits,
      offerNotes: o.offerNotes,
      status: o.status as any,
      createdBy: o.createdBy,
      offeredAt: new Date(o.offeredAt),
      respondedAt: o.respondedAt ? new Date(o.respondedAt) : undefined,
      createdAt: new Date(o.createdAt),
      updatedAt: new Date(o.updatedAt),
    }));
  },

  async getByCandidate(candidateId: string): Promise<Offer | null> {
    try {
      const response = await offersApi.getOffers(candidateId);
      if (response.length === 0) return null;
      const o = response[0];
      return {
        id: o.id,
        candidateId: o.candidateId,
        jobOrderId: o.jobOrderId,
        offeredRole: o.offeredRole,
        offeredSalary: String(o.offeredSalary),
        expectedJoiningDate: new Date(o.expectedJoiningDate),
        joiningBonus: o.joiningBonus,
        benefits: o.benefits,
        offerNotes: o.offerNotes,
        status: o.status as any,
        createdBy: o.createdBy,
        offeredAt: new Date(o.offeredAt),
        respondedAt: o.respondedAt ? new Date(o.respondedAt) : undefined,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  async getById(id: string): Promise<Offer | null> {
    try {
      const response = await offersApi.getOffer(id);
      return {
        id: response.id,
        candidateId: response.candidateId,
        jobOrderId: response.jobOrderId,
        offeredRole: response.offeredRole,
        offeredSalary: String(response.offeredSalary),
        expectedJoiningDate: new Date(response.expectedJoiningDate),
        joiningBonus: response.joiningBonus,
        benefits: response.benefits,
        offerNotes: response.offerNotes,
        status: response.status as any,
        createdBy: response.createdBy,
        offeredAt: new Date(response.offeredAt),
        respondedAt: response.respondedAt ? new Date(response.respondedAt) : undefined,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  async create(
    data: Omit<Offer, "id" | "createdAt" | "updatedAt">
  ): Promise<Offer> {
    const response = await offersApi.createOffer({
      candidateId: typeof data.candidateId === 'string' ? data.candidateId : (data.candidateId as any).id,
      jobOrderId: typeof data.jobOrderId === 'string' ? data.jobOrderId : (data.jobOrderId as any).id,
      offeredRole: data.offeredRole,
      offeredSalary: typeof data.offeredSalary === 'string' ? parseFloat(data.offeredSalary) : data.offeredSalary,
      expectedJoiningDate: data.expectedJoiningDate.toISOString(),
      offerNotes: data.offerNotes,
      status: data.status,
      createdBy: typeof data.createdBy === 'string' ? data.createdBy : (data.createdBy as any).id,
    });

    return {
      id: response.id,
      candidateId: response.candidateId,
      jobOrderId: response.jobOrderId,
      offeredRole: response.offeredRole,
      offeredSalary: String(response.offeredSalary),
      expectedJoiningDate: new Date(response.expectedJoiningDate),
      offerNotes: response.offerNotes,
      status: response.status as any,
      createdBy: response.createdBy,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  },

  async update(
    id: string,
    data: Partial<Omit<Offer, "id" | "createdAt" | "updatedAt">>
  ): Promise<Offer | null> {
    try {
      const updateData: any = {};
      if (data.offeredRole !== undefined) updateData.offeredRole = data.offeredRole;
      if (data.offeredSalary !== undefined) updateData.offeredSalary = data.offeredSalary;
      if (data.expectedJoiningDate !== undefined) updateData.expectedJoiningDate = data.expectedJoiningDate.toISOString();
      if (data.offerNotes !== undefined) updateData.offerNotes = data.offerNotes;
      if (data.status !== undefined) updateData.status = data.status;

      const response = await offersApi.updateOffer(id, updateData);

      return {
        id: response.id,
        candidateId: response.candidateId,
        jobOrderId: response.jobOrderId,
        offeredRole: response.offeredRole,
        offeredSalary: String(response.offeredSalary),
        expectedJoiningDate: new Date(response.expectedJoiningDate),
        joiningBonus: response.joiningBonus,
        benefits: response.benefits,
        offerNotes: response.offerNotes,
        status: response.status as any,
        createdBy: response.createdBy,
        offeredAt: new Date(response.offeredAt),
        respondedAt: response.respondedAt ? new Date(response.respondedAt) : undefined,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  async updateStatus(
    id: string,
    status: OfferStatus
  ): Promise<Offer | null> {
    return offerService.update(id, { status });
  },

  async delete(id: string): Promise<boolean> {
    try {
      await offersApi.deleteOffer(id);
      return true;
    } catch (error) {
      return false;
    }
  },
};
