export interface StoredAuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
}

const ACCESS_TOKEN_KEY =
  "intellisearch.access_token";

const REFRESH_TOKEN_KEY =
  "intellisearch.refresh_token";

const ID_TOKEN_KEY =
  "intellisearch.id_token";

export function saveAuthTokens(
  tokens: StoredAuthTokens,
): void {
  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    tokens.accessToken,
  );

  sessionStorage.setItem(
    REFRESH_TOKEN_KEY,
    tokens.refreshToken,
  );

  if (tokens.idToken) {
    sessionStorage.setItem(
      ID_TOKEN_KEY,
      tokens.idToken,
    );
  } else {
    sessionStorage.removeItem(
      ID_TOKEN_KEY,
    );
  }
}

export function getAuthTokens():
  StoredAuthTokens | null {
  const accessToken =
    sessionStorage.getItem(
      ACCESS_TOKEN_KEY,
    );

  const refreshToken =
    sessionStorage.getItem(
      REFRESH_TOKEN_KEY,
    );

  const idToken =
    sessionStorage.getItem(
      ID_TOKEN_KEY,
    );

  if (
    !accessToken ||
    !refreshToken
  ) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    idToken:
      idToken ?? undefined,
  };
}

export function clearAuthTokens(): void {
  sessionStorage.removeItem(
    ACCESS_TOKEN_KEY,
  );

  sessionStorage.removeItem(
    REFRESH_TOKEN_KEY,
  );

  sessionStorage.removeItem(
    ID_TOKEN_KEY,
  );
}