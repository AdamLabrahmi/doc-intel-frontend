import {
  create,
} from "zustand";

import {
  applyTheme,
} from "@/features/settings/services/theme.service";

import type {
  AppTheme,
  DocumentsPageSize,
  TechnicalDetailsMode,
} from "@/features/settings/types/settings.types";

interface PersistedSettings {
  theme: AppTheme;

  conversationAutoScroll: boolean;

  showConversationSources: boolean;

  documentsPerPage: DocumentsPageSize;

  technicalDetailsMode: TechnicalDetailsMode;
}

interface SettingsState
  extends PersistedSettings {
  setTheme: (
    theme: AppTheme,
  ) => void;

  setConversationAutoScroll: (
    enabled: boolean,
  ) => void;

  setShowConversationSources: (
    visible: boolean,
  ) => void;

  setDocumentsPerPage: (
    pageSize: DocumentsPageSize,
  ) => void;

  setTechnicalDetailsMode: (
    mode: TechnicalDetailsMode,
  ) => void;
}

export const SETTINGS_STORAGE_PREFIX =
  "intellisearch-settings";

const LEGACY_SETTINGS_STORAGE_KEY =
  SETTINGS_STORAGE_PREFIX;

const DEFAULT_SETTINGS:
  PersistedSettings =
{
  theme:
    "system",

  conversationAutoScroll:
    true,

  showConversationSources:
    true,

  documentsPerPage:
    10,

  technicalDetailsMode:
    "standard",
};


let activeSettingsUserId:
  string | null =
  null;

function buildUserSettingsStorageKey(
  userId: string,
): string {
  return `${SETTINGS_STORAGE_PREFIX}:${userId}`;
}

function isAppTheme(
  value: unknown,
): value is AppTheme {
  return (
    value ===
      "light" ||
    value ===
      "dark" ||
    value ===
      "system"
  );
}

function isDocumentsPageSize(
  value: unknown,
): value is DocumentsPageSize {
  return (
    value ===
      10 ||
    value ===
      20 ||
    value ===
      50
  );
}

function isTechnicalDetailsMode(
  value: unknown,
): value is TechnicalDetailsMode {
  return (
    value ===
      "standard" ||
    value ===
      "detailed"
  );
}

function sanitizePersistedSettings(
  value: unknown,
): PersistedSettings {
  if (
    typeof value !==
      "object" ||
    value ===
      null ||
    Array.isArray(
      value,
    )
  ) {
    return {
      ...DEFAULT_SETTINGS,
    };
  }

  const candidate =
    value as Partial<PersistedSettings>;

  return {
    theme:
      isAppTheme(
        candidate.theme,
      )
        ? candidate.theme
        : DEFAULT_SETTINGS.theme,

    conversationAutoScroll:
      typeof candidate.conversationAutoScroll ===
      "boolean"
        ? candidate.conversationAutoScroll
        : DEFAULT_SETTINGS.conversationAutoScroll,

    showConversationSources:
      typeof candidate.showConversationSources ===
      "boolean"
        ? candidate.showConversationSources
        : DEFAULT_SETTINGS.showConversationSources,

    documentsPerPage:
      isDocumentsPageSize(
        candidate.documentsPerPage,
      )
        ? candidate.documentsPerPage
        : DEFAULT_SETTINGS.documentsPerPage,

    technicalDetailsMode:
      isTechnicalDetailsMode(
        candidate.technicalDetailsMode,
      )
        ? candidate.technicalDetailsMode
        : DEFAULT_SETTINGS.technicalDetailsMode,
  };
}

function readUserSettings(
  userId: string,
): PersistedSettings {
  const storageKey =
    buildUserSettingsStorageKey(
      userId,
    );

  const rawValue =
    localStorage.getItem(
      storageKey,
    );

  if (!rawValue) {
    return {
      ...DEFAULT_SETTINGS,
    };
  }

  try {
    const parsedValue =
      JSON.parse(
        rawValue,
      );

    
    if (
      typeof parsedValue ===
        "object" &&
      parsedValue !==
        null &&
      !Array.isArray(
        parsedValue,
      ) &&
      "state" in
        parsedValue
    ) {
      return sanitizePersistedSettings(
        (
          parsedValue as {
            state?: unknown;
          }
        ).state,
      );
    }

    return sanitizePersistedSettings(
      parsedValue,
    );
  } catch {
    
    return {
      ...DEFAULT_SETTINGS,
    };
  }
}

function persistCurrentSettings(
  state: SettingsState,
): void {
  if (
    !activeSettingsUserId
  ) {
    
    return;
  }

  const storageKey =
    buildUserSettingsStorageKey(
      activeSettingsUserId,
    );

  const settings:
    PersistedSettings =
  {
    theme:
      state.theme,

    conversationAutoScroll:
      state.conversationAutoScroll,

    showConversationSources:
      state.showConversationSources,

    documentsPerPage:
      state.documentsPerPage,

    technicalDetailsMode:
      state.technicalDetailsMode,
  };

  localStorage.setItem(
    storageKey,
    JSON.stringify(
      settings,
    ),
  );
}

export const useSettingsStore =
  create<SettingsState>()(
    (
      set,
      get,
    ) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (
        theme,
      ) => {
        set({
          theme,
        });

        applyTheme(
          theme,
        );

        persistCurrentSettings(
          get(),
        );
      },

      setConversationAutoScroll: (
        enabled,
      ) => {
        set({
          conversationAutoScroll:
            enabled,
        });

        persistCurrentSettings(
          get(),
        );
      },

      setShowConversationSources: (
        visible,
      ) => {
        set({
          showConversationSources:
            visible,
        });

        persistCurrentSettings(
          get(),
        );
      },

      setDocumentsPerPage: (
        pageSize,
      ) => {
        set({
          documentsPerPage:
            pageSize,
        });

        persistCurrentSettings(
          get(),
        );
      },

      setTechnicalDetailsMode: (
        mode,
      ) => {
        set({
          technicalDetailsMode:
            mode,
        });

        persistCurrentSettings(
          get(),
        );
      },
    }),
  );


export function initializeSettingsForUser(
  userId: string,
): void {
  const normalizedUserId =
    userId.trim();

  if (
    normalizedUserId.length ===
    0
  ) {
    resetSettingsForAnonymousUser();

    return;
  }

  activeSettingsUserId =
    normalizedUserId;

  const settings =
    readUserSettings(
      normalizedUserId,
    );

  useSettingsStore.setState(
    settings,
  );

  applyTheme(
    settings.theme,
  );

  localStorage.removeItem(
    LEGACY_SETTINGS_STORAGE_KEY,
  );
}


export function resetSettingsForAnonymousUser(): void {
  activeSettingsUserId =
    null;

  useSettingsStore.setState({
    ...DEFAULT_SETTINGS,
  });

  applyTheme(
    DEFAULT_SETTINGS.theme,
  );
}