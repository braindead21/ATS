import { Company } from "@/types";
import { companiesApi } from "@/lib/api";

export const companyService = {
  // Get all companies
  getAll: async (): Promise<Company[]> => {
    const response = await companiesApi.getCompanies();
    return response.map((c) => ({
      id: c.id,
      name: c.name,
      primaryPhone: c.primaryPhone,
      secondaryPhone: c.secondaryPhone,
      faxNumber: c.faxNumber,
      address: c.address,
      city: c.city,
      state: c.state,
      postalCode: c.postalCode,
      webSite: c.webSite,
      departments: c.departments,
      keyTechnologies: c.keyTechnologies,
      miscNotes: c.miscNotes,
      isHotCompany: c.isHotCompany,
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
        primaryPhone: response.primaryPhone,
        secondaryPhone: response.secondaryPhone,
        faxNumber: response.faxNumber,
        address: response.address,
        city: response.city,
        state: response.state,
        postalCode: response.postalCode,
        webSite: response.webSite,
        departments: response.departments,
        keyTechnologies: response.keyTechnologies,
        miscNotes: response.miscNotes,
        isHotCompany: response.isHotCompany,
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
      primaryPhone: data.primaryPhone,
      secondaryPhone: data.secondaryPhone,
      faxNumber: data.faxNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      webSite: data.webSite,
      departments: data.departments,
      keyTechnologies: data.keyTechnologies,
      miscNotes: data.miscNotes,
      isHotCompany: data.isHotCompany,
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
      primaryPhone: response.primaryPhone,
      secondaryPhone: response.secondaryPhone,
      faxNumber: response.faxNumber,
      address: response.address,
      city: response.city,
      state: response.state,
      postalCode: response.postalCode,
      webSite: response.webSite,
      departments: response.departments,
      keyTechnologies: response.keyTechnologies,
      miscNotes: response.miscNotes,
      isHotCompany: response.isHotCompany,
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
        primaryPhone: data.primaryPhone,
        secondaryPhone: data.secondaryPhone,
        faxNumber: data.faxNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        webSite: data.webSite,
        departments: data.departments,
        keyTechnologies: data.keyTechnologies,
        miscNotes: data.miscNotes,
        isHotCompany: data.isHotCompany,
        industry: data.industry,
        location: data.location,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        status: data.status,
      } as any);

      return {
        id: response.id,
        name: response.name,
        primaryPhone: response.primaryPhone,
        secondaryPhone: response.secondaryPhone,
        faxNumber: response.faxNumber,
        address: response.address,
        city: response.city,
        state: response.state,
        postalCode: response.postalCode,
        webSite: response.webSite,
        departments: response.departments,
        keyTechnologies: response.keyTechnologies,
        miscNotes: response.miscNotes,
        isHotCompany: response.isHotCompany,
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
