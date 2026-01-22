/**
 * Offers API Service
 */

export interface OfferData {
  id?: string;
  candidateId: string;
  jobOrderId: string;
  offeredRole: string;
  offeredSalary: number;
  expectedJoiningDate: string;
  offerNotes?: string;
  status?: string;
  createdBy: string;
}

export interface OfferResponse {
  id: string;
  candidateId: any;
  jobOrderId: any;
  offeredRole: string;
  offeredSalary: number;
  expectedJoiningDate: string;
  joiningBonus?: number;
  benefits?: string;
  offerNotes?: string;
  status: string;
  createdBy: any;
  offeredAt: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getOffers(candidateId?: string): Promise<OfferResponse[]> {
  const url = candidateId ? `/api/offers?candidateId=${candidateId}` : "/api/offers";
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch offers");
  }

  return response.json();
}

export async function getOffer(id: string): Promise<OfferResponse> {
  const response = await fetch(`/api/offers/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch offer");
  }

  return response.json();
}

export async function createOffer(data: OfferData): Promise<OfferResponse> {
  const response = await fetch("/api/offers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create offer");
  }

  return response.json();
}

export async function updateOffer(id: string, data: Partial<OfferData>): Promise<OfferResponse> {
  const response = await fetch(`/api/offers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update offer");
  }

  return response.json();
}

export async function deleteOffer(id: string): Promise<void> {
  const response = await fetch(`/api/offers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete offer");
  }
}
