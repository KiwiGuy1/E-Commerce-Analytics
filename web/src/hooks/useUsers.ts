"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api";
import type { User } from "@/types/analytics";

type UseUsersOptions = {
  live?: boolean;
  pollIntervalMs?: number;
};

export function useUsers(options: UseUsersOptions = {}) {
  const { live = true, pollIntervalMs = 5000 } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newCustomers, setNewCustomers] = useState<User[]>([]);

  const knownUserIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refetch = useCallback(async (config?: { silent?: boolean }) => {
    const silent = config?.silent ?? false;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await apiClient.getUsers();

      if (initializedRef.current) {
        const added = result.filter(
          (user) => !knownUserIdsRef.current.has(user._id),
        );
        if (added.length > 0) {
          setNewCustomers(added);
          if (dismissTimerRef.current) {
            clearTimeout(dismissTimerRef.current);
          }
          dismissTimerRef.current = setTimeout(() => {
            setNewCustomers([]);
          }, 6000);
        }
      }

      setUsers(result);
      knownUserIdsRef.current = new Set(result.map((user) => user._id));
      initializedRef.current = true;
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("Unable to load customers right now.");
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

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [refetch]);

  useEffect(() => {
    if (!live || pollIntervalMs <= 0) return;

    const timer = setInterval(() => {
      void refetch({ silent: true });
    }, pollIntervalMs);

    return () => clearInterval(timer);
  }, [live, pollIntervalMs, refetch]);

  return {
    users,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    newCustomers,
    refetch,
  };
}
