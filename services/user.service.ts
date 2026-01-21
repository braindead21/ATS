import { User } from "@/types";
import { UserRole } from "@/lib/constants/enums";

export const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // Get users by role
  getByRole: async (role: UserRole): Promise<User[]> => {
    const response = await fetch(`/api/users?role=${role}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users by role');
    }
    return response.json();
  },

  // Get user by ID
  getById: async (id: string): Promise<User | null> => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },
};
