/**
 * Candidates API Service
 */

export interface CandidateData {
  id?: string;
  jobOrderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  status?: string;
  currentLevel?: string;
  addedBy: string;
}

export interface CandidateResponse {
  id: string;
  jobOrderId: any;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  status: string;
  currentLevel?: string;
  addedBy: any;
  createdAt: string;
  updatedAt: string;
}

export async function getCandidates(jobOrderId?: string): Promise<CandidateResponse[]> {
  const url = jobOrderId ? `/api/candidates?jobOrderId=${jobOrderId}` : "/api/candidates";
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch candidates");
  }

  return response.json();
}

export async function getCandidate(id: string): Promise<CandidateResponse> {
  const response = await fetch(`/api/candidates/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch candidate");
  }

  return response.json();
}

export async function createCandidate(data: CandidateData): Promise<CandidateResponse> {
  const response = await fetch("/api/candidates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create candidate");
  }

  return response.json();
}

export async function updateCandidate(id: string, data: Partial<CandidateData>): Promise<CandidateResponse> {
  const response = await fetch(`/api/candidates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update candidate");
  }

  return response.json();
}

export async function deleteCandidate(id: string): Promise<void> {
  const response = await fetch(`/api/candidates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete candidate");
  }
}
