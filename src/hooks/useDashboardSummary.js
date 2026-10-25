import {
  useQuery
} from "@tanstack/react-query";

import {
  fetchDashboardSummary
} from "../lib/api";


export function useDashboardSummary() {

  return useQuery({

    queryKey: [
      "dashboard",
      "summary"
    ],

    queryFn:
      fetchDashboardSummary,

    /*
     * These numbers won't change every second.
     *
     * Five minutes is more than adequate
     * for the public dashboard.
     */
    staleTime:
      15 * 60 * 1000,

    refetchOnWindowFocus: false,
    retry: 1
  });
}