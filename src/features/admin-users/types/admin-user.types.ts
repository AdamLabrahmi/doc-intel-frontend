export type AdminUserRole =
  | "ADMIN"
  | "USER";

export interface AdminUser {
  keycloakId: string;
  fullName: string;
  email: string | null;
  role: AdminUserRole;
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: AdminUserRole;
}

export interface ChangeAdminUserRoleRequest {
  role: AdminUserRole;
}