import { Company } from "@/types";
import { CompanyStatus } from "@/lib/constants/enums";
import { mockCompanies } from "@/lib/mock-data";

// In-memory store
let companies: Company[] = [...mockCompanies];

export const companyService = {
  // Get all companies
  getAll: async (): Promise<Company[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...companies];
  },

  // Get company by ID
  getById: async (id: string): Promise<Company | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return companies.find((c) => c.id === id) || null;
  },

  // Create company
  create: async (data: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const newCompany: Company = {
      ...data,
      id: `c${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    companies.push(newCompany);
    return newCompany;
  },

  // Update company
  update: async (id: string, data: Partial<Company>): Promise<Company | null> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const index = companies.findIndex((c) => c.id === id);
    if (index === -1) return null;
    
    companies[index] = {
      ...companies[index],
      ...data,
      updatedAt: new Date(),
    };
    
    return companies[index];
  },

  // Delete company
  delete: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = companies.findIndex((c) => c.id === id);
    if (index === -1) return false;
    
    companies.splice(index, 1);
    return true;
  },
};
