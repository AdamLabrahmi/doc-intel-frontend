export type AuthenticatedUserRole =
  | "ADMIN"
  | "USER";

export interface AuthenticatedUserDto {
  id: number;
  keycloakId: string;

  firstName: string;
  lastName: string;

  fullName: string;
  email: string;

  role: AuthenticatedUserRole;

  createdAt: string;
  updatedAt: string;
}