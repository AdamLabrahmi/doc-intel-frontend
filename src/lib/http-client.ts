import axios from "axios";

import { env } from "@/config/env.config";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 120_000,
  headers: {
    Accept: "application/json",
  },
});