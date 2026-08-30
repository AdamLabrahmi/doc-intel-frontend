import { env } from "@/config/env.config";

export async function logoutFromKeycloak(
  refreshToken: string,
): Promise<void> {
  const body =
    new URLSearchParams();

  body.set(
    "client_id",
    env.keycloak.clientId,
  );

  body.set(
    "refresh_token",
    refreshToken,
  );

  const response =
    await fetch(
      `${env.keycloak.url}/realms/${env.keycloak.realm}/protocol/openid-connect/logout`,
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
    throw new Error(
      "La fermeture de la session Keycloak a échoué.",
    );
  }
}