export interface LoginRequest {
  username: string;
  password: string;
}

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;

  refresh_token: string;
  refresh_expires_in: number;

  id_token?: string;

  token_type: string;
  session_state?: string;
  scope?: string;
}

const KEYCLOAK_BASE_URL =
  "http://localhost:9090";

const KEYCLOAK_REALM =
  "doc-intel-realm";

const KEYCLOAK_CLIENT_ID =
  "doc-intel-frontend";

export async function loginWithCredentials(
  request: LoginRequest,
): Promise<KeycloakTokenResponse> {
  const body =
    new URLSearchParams();

  body.set(
    "grant_type",
    "password",
    
  );

  body.set(
    "client_id",
    KEYCLOAK_CLIENT_ID,
  );

  body.set(
    "username",
    request.username,
  );

  body.set(
    "password",
    request.password,
  );

  const response =
    await fetch(
      `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body,
      },
    );

  if (!response.ok) {
    if (
      response.status === 400 ||
      response.status === 401
    ) {
      throw new Error(
        "Identifiants incorrects.",
      );
    }

    throw new Error(
      "Impossible de contacter le serveur d’authentification.",
    );
  }

  return response.json();
}