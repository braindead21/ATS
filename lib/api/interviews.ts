/**
 * Interviews API Service
 */

export interface InterviewData {
  id?: string;
  candidateId: string;
  jobOrderId: string;
  level: string;
  scheduledAt: string;
  status?: string;
  feedback?: string;
  interviewerName?: string;
  createdBy: string;
}

export interface InterviewResponse {
  id: string;
  candidateId: any;
  jobOrderId: any;
  level: string;
  scheduledAt: string;
  status: string;
  feedback?: string;
  interviewerName?: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

export async function getInterviews(candidateId?: string): Promise<InterviewResponse[]> {
  const url = candidateId ? `/api/interviews?candidateId=${candidateId}` : "/api/interviews";
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch interviews");
  }

  return response.json();
}

export async function getInterview(id: string): Promise<InterviewResponse> {
  const response = await fetch(`/api/interviews/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch interview");
  }

  return response.json();
}

export async function createInterview(data: InterviewData): Promise<InterviewResponse> {
  const response = await fetch("/api/interviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create interview");
  }

  return response.json();
}

export async function updateInterview(id: string, data: Partial<InterviewData>): Promise<InterviewResponse> {
  const response = await fetch(`/api/interviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update interview");
  }

  return response.json();
}

export async function deleteInterview(id: string): Promise<void> {
  const response = await fetch(`/api/interviews/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete interview");
  }
}
