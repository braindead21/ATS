"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in, redirect to login
      router.push("/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      // Wrong role, redirect to their correct dashboard
      const roleRoute = user.role.toLowerCase();
      router.push(`/${roleRoute}/dashboard`);
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  // Don't render anything until auth check is complete
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Check if user has the right role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}
