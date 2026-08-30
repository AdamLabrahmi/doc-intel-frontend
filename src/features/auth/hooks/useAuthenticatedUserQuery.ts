import { useQuery } from "@tanstack/react-query";

import {
  getAuthenticatedUser,
} from "@/features/auth/api/authenticated-user.api";

export const authenticatedUserQueryKeys = {
  all: ["authenticated-user"] as const,
};

export function useAuthenticatedUserQuery() {
  return useQuery({
    queryKey:
      authenticatedUserQueryKeys.all,

    queryFn:
      getAuthenticatedUser,

    staleTime:
      5 * 60 * 1_000,
  });
}