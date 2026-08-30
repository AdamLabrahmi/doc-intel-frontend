import { httpClient } from "@/lib/http-client";

import type {
  AuthenticatedUserDto,
} from "@/features/auth/types/authenticated-user.types";

import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "@/features/profile/types/profile.types";

export async function updateProfile(
  request: UpdateProfileRequest,
): Promise<AuthenticatedUserDto> {
  const response =
    await httpClient.put<
      AuthenticatedUserDto
    >(
      "/api/users/me",
      request,
    );

  return response.data;
}

export async function changePassword(
  request: ChangePasswordRequest,
): Promise<void> {
  await httpClient.put(
    "/api/users/me/password",
    request,
  );
}