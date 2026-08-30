import axios from "axios";

import { env } from "@/config/env.config";
import { keycloak } from "@/config/keycloak.config";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 120_000,
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use(
  async (config) => {
    if (!keycloak.authenticated) {
      return config;
    }

    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.error(
        "Impossible de rafraîchir le token Keycloak.",
        error,
      );

      await keycloak.login({
        redirectUri: window.location.href,
      });

      return config;
    }

    if (keycloak.token) {
      config.headers.Authorization =
        `Bearer ${keycloak.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);