import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  authenticatedUserQueryKeys,
} from "@/features/auth/hooks/useAuthenticatedUserQuery";

import {
  updateProfile,
} from "@/features/profile/api/profile.api";

export function useUpdateProfileMutation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateProfile,

    onSuccess: async (
      updatedUser,
    ) => {
      queryClient.setQueryData(
        authenticatedUserQueryKeys.all,
        updatedUser,
      );

      await queryClient.invalidateQueries({
        queryKey:
          authenticatedUserQueryKeys.all,
      });
    },
  });
}