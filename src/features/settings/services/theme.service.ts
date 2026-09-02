import type {
  AppTheme,
} from "@/features/settings/types/settings.types";

const DARK_CLASS_NAME =
  "dark";

const SYSTEM_DARK_MODE_QUERY =
  "(prefers-color-scheme: dark)";

export function resolveEffectiveTheme(
  theme: AppTheme,
): "light" | "dark" {
  if (
    theme === "light" ||
    theme === "dark"
  ) {
    return theme;
  }

  if (
    typeof window ===
    "undefined"
  ) {
    return "light";
  }

  return window.matchMedia(
    SYSTEM_DARK_MODE_QUERY,
  ).matches
    ? "dark"
    : "light";
}

export function applyTheme(
  theme: AppTheme,
): void {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  const effectiveTheme =
    resolveEffectiveTheme(
      theme,
    );

  document.documentElement.classList.toggle(
    DARK_CLASS_NAME,
    effectiveTheme ===
      "dark",
  );

  document.documentElement.dataset.theme =
    effectiveTheme;

  document.documentElement.style.colorScheme =
    effectiveTheme;
}

export function subscribeToSystemTheme(
  callback: () => void,
): () => void {
  if (
    typeof window ===
    "undefined"
  ) {
    return () =>
      undefined;
  }

  const mediaQuery =
    window.matchMedia(
      SYSTEM_DARK_MODE_QUERY,
    );

  const handleChange =
    () => {
      callback();
    };

  mediaQuery.addEventListener(
    "change",
    handleChange,
  );

  return () => {
    mediaQuery.removeEventListener(
      "change",
      handleChange,
    );
  };
}