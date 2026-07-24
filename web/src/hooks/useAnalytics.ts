"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsData } from "@/types/analytics";
import { apiClient } from "@/lib/api";

type UseAnalyticsOptions = {
  live?: boolean;
  pollIntervalMs?: number;
};

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { live = true, pollIntervalMs = 5000 } = options;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refetch = useCallback(async (config?: { silent?: boolean }) => {
    const silent = config?.silent ?? false;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const analytics = await apiClient.getAnalytics();
      setData(analytics);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("Unable to load analytics data right now.");
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!live || pollIntervalMs <= 0) return;

    const timer = setInterval(() => {
      void refetch({ silent: true });
    }, pollIntervalMs);

    return () => clearInterval(timer);
  }, [live, pollIntervalMs, refetch]);

  return { data, isLoading, isRefreshing, error, lastUpdated, refetch };
}
