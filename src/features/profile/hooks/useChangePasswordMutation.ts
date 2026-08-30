import {
  useMutation,
} from "@tanstack/react-query";

import {
  changePassword,
} from "@/features/profile/api/profile.api";

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn:
      changePassword,
  });
}