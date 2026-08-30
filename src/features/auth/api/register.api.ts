import { httpClient } from "@/lib/http-client";

export interface RegisterRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export async function registerUser(
  request: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } =
    await httpClient.post<RegisterResponse>(
      "/api/auth/register",
      request,
    );

  return data;
}