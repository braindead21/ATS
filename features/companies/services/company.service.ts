import { Company } from "@/types";
import { companiesApi } from "@/lib/api";

export const companyService = {
  // Get all companies
  getAll: async (): Promise<Company[]> => {
    const response = await companiesApi.getCompanies();
    return response.map((c) => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      location: c.location,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      status: c.status as any,
      createdBy: c.createdBy,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    }));
  },

  // Get company by ID
  getById: async (id: string): Promise<Company | null> => {
    try {
      const response = await companiesApi.getCompany(id);
      return {
        id: response.id,
        name: response.name,
        industry: response.industry,
        location: response.location,
        contactEmail: response.contactEmail,
        contactPhone: response.contactPhone,
        status: response.status as any,
        createdBy: response.createdBy,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  // Create company
  create: async (data: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> => {
    const response = await companiesApi.createCompany({
      name: data.name,
      industry: data.industry,
      location: data.location,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      status: data.status,
      createdBy: typeof data.createdBy === 'string' ? data.createdBy : (data.createdBy as any).id,
    });

    return {
      id: response.id,
      name: response.name,
      industry: response.industry,
      location: response.location,
      contactEmail: response.contactEmail,
      contactPhone: response.contactPhone,
      status: response.status as any,
      createdBy: response.createdBy,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  },

  // Update company
  update: async (id: string, data: Partial<Company>): Promise<Company | null> => {
    try {
      const response = await companiesApi.updateCompany(id, {
        name: data.name,
        industry: data.industry,
        location: data.location,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        status: data.status,
      } as any);

      return {
        id: response.id,
        name: response.name,
        industry: response.industry,
        location: response.location,
        contactEmail: response.contactEmail,
        contactPhone: response.contactPhone,
        status: response.status as any,
        createdBy: response.createdBy,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };
    } catch (error) {
      return null;
    }
  },

  // Delete company
  delete: async (id: string): Promise<boolean> => {
    try {
      await companiesApi.deleteCompany(id);
      return true;
    } catch (error) {
      return false;
    }
  },
};
