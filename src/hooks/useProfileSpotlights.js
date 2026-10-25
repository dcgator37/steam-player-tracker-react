import {
  useQuery
} from "@tanstack/react-query";

import {
  fetchProfileSpotlights
} from "../lib/api";


export function useProfileSpotlights() {

  return useQuery({

    queryKey: [
      "dashboard",
      "profile-spotlights"
    ],

    queryFn:
      fetchProfileSpotlights,

    staleTime:
      10 * 60 * 1000,

    refetchOnWindowFocus:
      false,

    retry:
      1
  });
}