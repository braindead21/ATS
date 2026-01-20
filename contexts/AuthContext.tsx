"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "ats_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Get users from localStorage
    const usersData = localStorage.getItem("ats_users");
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    // Find user by email and password
    const foundUser = users.find(
      (u) => u.email === email && (u as any).password === password
    );

    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    // Remove password from user object before storing
    const { password: _, ...userWithoutPassword } = foundUser as any;
    const authenticatedUser = userWithoutPassword as User;

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    // Get existing users
    const usersData = localStorage.getItem("ats_users");
    const users: any[] = usersData ? JSON.parse(usersData) : [];

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      throw new Error("Email already exists");
    }

    // Create new user
    const newUser = {
      id: `user${Date.now()}`,
      email,
      name,
      role,
      password, // Store password in mock users (will be removed from auth user)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to users list
    users.push(newUser);
    localStorage.setItem("ats_users", JSON.stringify(users));

    // Auto-login (without password in auth state)
    const { password: _, ...userWithoutPassword } = newUser;
    const authenticatedUser = {
      ...userWithoutPassword,
      createdAt: new Date(userWithoutPassword.createdAt),
      updatedAt: new Date(userWithoutPassword.updatedAt),
    } as User;

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
