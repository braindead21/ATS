/**
 * Job Orders API Service
 */

export interface JobOrderData {
  id?: string;
  companyId: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  salaryRange?: string;
  positions?: number;
  status?: string;
  createdBy: string;
  assignedRecruiters?: string[];
}

export interface JobOrderResponse {
  id: string;
  companyId: any;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  salaryRange?: string;
  positions: number;
  status: string;
  createdBy: any;
  assignedRecruiters: any[];
  createdAt: string;
  updatedAt: string;
}

export async function getJobOrders(): Promise<JobOrderResponse[]> {
  const response = await fetch("/api/job-orders");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch job orders");
  }

  return response.json();
}

export async function getJobOrder(id: string): Promise<JobOrderResponse> {
  const response = await fetch(`/api/job-orders/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch job order");
  }

  return response.json();
}

export async function createJobOrder(data: JobOrderData): Promise<JobOrderResponse> {
  const response = await fetch("/api/job-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create job order");
  }

  return response.json();
}

export async function updateJobOrder(id: string, data: Partial<JobOrderData>): Promise<JobOrderResponse> {
  const response = await fetch(`/api/job-orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update job order");
  }

  return response.json();
}

export async function deleteJobOrder(id: string): Promise<void> {
  const response = await fetch(`/api/job-orders/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete job order");
  }
}
