import { httpClient } from "@/lib/http-client";

import type {
  AuthenticatedUserDto,
} from "@/features/auth/types/authenticated-user.types";

export async function getAuthenticatedUser():
Promise<AuthenticatedUserDto> {
  const response =
    await httpClient.get<AuthenticatedUserDto>(
      "/api/users/me",
    );

  return response.data;
}