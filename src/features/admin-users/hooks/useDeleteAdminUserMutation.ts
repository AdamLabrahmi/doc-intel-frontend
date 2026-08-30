import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteAdminUser,
} from "@/features/admin-users/api/admin-users.api";

import {
  adminUserQueryKeys,
} from "@/features/admin-users/hooks/useAdminUsersQuery";

export function useDeleteAdminUserMutation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          adminUserQueryKeys.all,
      });
    },
  });
}