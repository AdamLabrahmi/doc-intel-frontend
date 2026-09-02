import {
  applyTheme,
  subscribeToSystemTheme,
} from "@/features/settings/services/theme.service";

import {
  useSettingsStore,
} from "@/stores/settings.store";

let unsubscribeSystemTheme:
  (() => void)
  | null =
  null;

export function initializeApplicationTheme(): void {
  const currentTheme =
    useSettingsStore
      .getState()
      .theme;

  applyTheme(
    currentTheme,
  );

  unsubscribeSystemTheme?.();

  unsubscribeSystemTheme =
    subscribeToSystemTheme(
      () => {
        const theme =
          useSettingsStore
            .getState()
            .theme;

        if (
          theme !==
          "system"
        ) {
          return;
        }

        applyTheme(
          theme,
        );
      },
    );
}