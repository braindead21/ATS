"use client";

import { StatCard } from "@/components/ui";
import { Building2, Briefcase, Users, BarChart3, RefreshCw } from "lucide-react";
import { useDashboardStats } from "@/features/analytics/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  // Fetch dashboard stats with auto-refresh every 30 seconds
  const { stats, loading, error, refetch } = useDashboardStats(30000);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
          <p className="text-destructive">Error loading dashboard: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Complete system overview and analytics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value={loading ? "..." : stats?.companies.total ?? 0}
          icon={Building2}
          description="Active clients"
          trend={{
            value: stats?.companies.trend ?? 0,
            isPositive: (stats?.companies.trend ?? 0) >= 0,
          }}
        />
        <StatCard
          title="Active Job Orders"
          value={loading ? "..." : stats?.jobOrders.active ?? 0}
          icon={Briefcase}
          description="Open positions"
          trend={{
            value: stats?.jobOrders.trend ?? 0,
            isPositive: (stats?.jobOrders.trend ?? 0) >= 0,
          }}
        />
        <StatCard
          title="Total Candidates"
          value={loading ? "..." : stats?.candidates.total ?? 0}
          icon={Users}
          description="In pipeline"
          trend={{
            value: stats?.candidates.trend ?? 0,
            isPositive: (stats?.candidates.trend ?? 0) >= 0,
          }}
        />
        <StatCard
          title="Placements"
          value={loading ? "..." : stats?.placements.thisMonth ?? 0}
          icon={BarChart3}
          description="This month"
          trend={{
            value: stats?.placements.trend ?? 0,
            isPositive: (stats?.placements.trend ?? 0) >= 0,
          }}
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
