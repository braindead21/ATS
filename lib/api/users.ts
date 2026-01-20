/**
 * Users API Service
 */

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUsers(): Promise<UserResponse[]> {
  const response = await fetch("/api/users");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch users");
  }

  return response.json();
}
