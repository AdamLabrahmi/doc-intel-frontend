import {
  useAuthenticatedUserQuery,
} from "@/features/auth/hooks/useAuthenticatedUserQuery";

export function useCurrentUser() {
  const query =
    useAuthenticatedUserQuery();

  const user =
    query.data ?? null;

  const isAdmin =
    user?.role ===
    "ADMIN";

  const isUser =
    user?.role ===
    "USER";

  return {
    ...query,
    user,
    isAdmin,
    isUser,
  };
}