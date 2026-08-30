import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  changeAdminUserRole,
} from "@/features/admin-users/api/admin-users.api";

import {
  adminUserQueryKeys,
} from "@/features/admin-users/hooks/useAdminUsersQuery";

import type {
  AdminUserRole,
} from "@/features/admin-users/types/admin-user.types";

interface ChangeAdminUserRoleVariables {
  keycloakId: string;
  role: AdminUserRole;
}

export function useChangeAdminUserRoleMutation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      keycloakId,
      role,
    }: ChangeAdminUserRoleVariables) =>
      changeAdminUserRole(
        keycloakId,
        {
          role,
        },
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          adminUserQueryKeys.all,
      });
    },
  });
}