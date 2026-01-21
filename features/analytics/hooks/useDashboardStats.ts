"use client";

import { useState, useEffect } from "react";
import { fetchDashboardStats, DashboardStats } from "../services/analyticsService";

interface UseDashboardStatsResult {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage dashboard statistics
 * @param refreshInterval - Optional interval in milliseconds to auto-refresh data
 */
export function useDashboardStats(
  refreshInterval?: number
): UseDashboardStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up auto-refresh if interval is provided
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
