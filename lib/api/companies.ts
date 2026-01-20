/**
 * Companies API Service
 */

export interface CompanyData {
  id?: string;
  name: string;
  industry?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  createdBy: string;
}

export interface CompanyResponse {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

export async function getCompanies(): Promise<CompanyResponse[]> {
  const response = await fetch("/api/companies");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch companies");
  }

  return response.json();
}

export async function getCompany(id: string): Promise<CompanyResponse> {
  const response = await fetch(`/api/companies/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch company");
  }

  return response.json();
}

export async function createCompany(data: CompanyData): Promise<CompanyResponse> {
  const response = await fetch("/api/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create company");
  }

  return response.json();
}

export async function updateCompany(id: string, data: Partial<CompanyData>): Promise<CompanyResponse> {
  const response = await fetch(`/api/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update company");
  }

  return response.json();
}

export async function deleteCompany(id: string): Promise<void> {
  const response = await fetch(`/api/companies/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete company");
  }
}
