const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("La variable d'environnement VITE_API_BASE_URL est manquante.",);
}

export const env = {
     apiBaseUrl,
} as const;