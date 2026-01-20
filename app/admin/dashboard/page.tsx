"use client";

import { StatCard } from "@/components/ui";
import { Building2, Briefcase, Users, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Complete system overview and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value={24}
          icon={Building2}
          description="Active clients"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Job Orders"
          value={156}
          icon={Briefcase}
          description="Open positions"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Candidates"
          value={1248}
          icon={Users}
          description="In pipeline"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Placements"
          value={89}
          icon={BarChart3}
          description="This month"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Placeholder for future charts/tables */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground text-sm">
          Activity logs and analytics will be displayed here in future phases.
        </p>
      </div>
    </div>
  );
}
