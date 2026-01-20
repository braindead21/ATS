"use client";

import { Sidebar, Header } from "@/components/layout";
import { RouteGuard } from "@/components/RouteGuard";
import { useAuth } from "@/hooks";
import { getNavItems } from "@/lib/constants/navigation";
import { UserRole } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const navItems = user ? getNavItems(user.role) : [];

  return (
    <RouteGuard allowedRoles={[UserRole.ADMIN]}>
      <div className="min-h-screen bg-background">
        <Sidebar items={navItems} />
        <div className="pl-64">
          <Header user={user} />
          <main className="pt-16">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
