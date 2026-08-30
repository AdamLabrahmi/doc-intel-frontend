import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminUser,
} from "@/features/admin-users/api/admin-users.api";

import {
  adminUserQueryKeys,
} from "@/features/admin-users/hooks/useAdminUsersQuery";

export function useCreateAdminUserMutation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createAdminUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          adminUserQueryKeys.all,
      });
    },
  });
}