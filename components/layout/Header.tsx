"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { User } from "@/types";
import { LogOut, User as UserIcon } from "lucide-react";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  
  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/companies")) return "Companies";
    if (pathname.includes("/job-orders")) return "Job Orders";
    if (pathname.includes("/candidates")) return "Candidates";
    if (pathname.includes("/analytics")) return "Analytics";
    if (pathname.includes("/users")) return "Users";
    return "Dashboard";
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <header className="fixed right-0 top-0 z-30 h-16 border-b bg-card" style={{ left: "16rem" }}>
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
