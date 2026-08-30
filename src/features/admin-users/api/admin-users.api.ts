import {
  httpClient,
} from "@/lib/http-client";

import type {
  AdminUser,
  ChangeAdminUserRoleRequest,
  CreateAdminUserRequest,
} from "@/features/admin-users/types/admin-user.types";

const ADMIN_USERS_ENDPOINT =
  "/api/admin/users";

export async function getAdminUsers():
  Promise<AdminUser[]> {

  const response =
    await httpClient.get<
      AdminUser[]
    >(
      ADMIN_USERS_ENDPOINT,
    );

  return response.data;
}

export async function createAdminUser(
  request: CreateAdminUserRequest,
): Promise<void> {

  await httpClient.post(
    ADMIN_USERS_ENDPOINT,
    request,
  );
}

export async function changeAdminUserRole(
  keycloakId: string,
  request: ChangeAdminUserRoleRequest,
): Promise<void> {

  await httpClient.patch(
    `${ADMIN_USERS_ENDPOINT}/${encodeURIComponent(
      keycloakId,
    )}/role`,
    request,
  );
}

export async function deleteAdminUser(
  keycloakId: string,
): Promise<void> {

  await httpClient.delete(
    `${ADMIN_USERS_ENDPOINT}/${encodeURIComponent(
      keycloakId,
    )}`,
  );
}