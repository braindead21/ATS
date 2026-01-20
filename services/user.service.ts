import { User } from "@/types";
import { UserRole } from "@/lib/constants/enums";
import { mockUsers } from "@/lib/mock-data";

export const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockUsers];
  },

  // Get users by role
  getByRole: async (role: UserRole): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUsers.filter((u) => u.role === role);
  },

  // Get user by ID
  getById: async (id: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockUsers.find((u) => u.id === id) || null;
  },
};
