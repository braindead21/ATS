/**
 * Analytics Service
 * Handles fetching analytics data from the API
 */

export interface DashboardStats {
  companies: {
    total: number;
    active: number;
    trend: number;
  };
  jobOrders: {
    total: number;
    active: number;
    trend: number;
  };
  candidates: {
    total: number;
    inPipeline: number;
    trend: number;
  };
  placements: {
    thisMonth: number;
    total: number;
    trend: number;
  };
}

/**
 * Fetch dashboard statistics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("/api/analytics/stats", {
    cache: "no-store", // Ensure fresh data
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
}
