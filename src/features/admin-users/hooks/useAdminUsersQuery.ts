import {
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminUsers,
} from "@/features/admin-users/api/admin-users.api";

export const adminUserQueryKeys = {
  all: [
    "admin-users",
  ] as const,
};

export function useAdminUsersQuery(
  enabled = true,
) {
  return useQuery({
    queryKey:
      adminUserQueryKeys.all,

    queryFn:
      getAdminUsers,

    enabled,
  });
}