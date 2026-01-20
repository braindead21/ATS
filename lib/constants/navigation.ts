import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Users, 
  BarChart3,
  UserCog 
} from "lucide-react";
import { NavItem } from "@/components/layout/Sidebar";
import { UserRole } from "./enums";

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Companies",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserCog,
  },
];

export const LEADER_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/leader/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Companies",
    href: "/leader/companies",
    icon: Building2,
  },
  {
    label: "Job Orders",
    href: "/leader/job-orders",
    icon: Briefcase,
  },
  {
    label: "Candidates",
    href: "/leader/candidates",
    icon: Users,
  },
];

export const RECRUITER_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/recruiter/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Assigned Jobs",
    href: "/recruiter/job-orders",
    icon: Briefcase,
  },
  {
    label: "Candidates",
    href: "/recruiter/candidates",
    icon: Users,
  },
];

export function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case UserRole.ADMIN:
      return ADMIN_NAV_ITEMS;
    case UserRole.LEADER:
      return LEADER_NAV_ITEMS;
    case UserRole.RECRUITER:
      return RECRUITER_NAV_ITEMS;
    default:
      return [];
  }
}
