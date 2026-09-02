import {
  BookOpenText,
  FileText,
  Monitor,
  Moon,
  Palette,
  ScrollText,
  Settings2,
  Sun,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  useSettingsStore,
} from "@/stores/settings.store";

import type {
  AppTheme,
  DocumentsPageSize,
  TechnicalDetailsMode,
} from "@/features/settings/types/settings.types";

interface ThemeOption {
  value: AppTheme;
  title: string;
  description: string;
  icon: typeof Sun;
}

interface PageSizeOption {
  value: DocumentsPageSize;
  label: string;
}

interface TechnicalModeOption {
  value: TechnicalDetailsMode;
  title: string;
  description: string;
}

const THEME_OPTIONS:
  readonly ThemeOption[] =
[
  {
    value:
      "light",

    title:
      "Clair",

    description:
      "Toujours utiliser l'interface claire.",

    icon:
      Sun,
  },

  {
    value:
      "dark",

    title:
      "Sombre",

    description:
      "Toujours utiliser l'interface sombre.",

    icon:
      Moon,
  },

  {
    value:
      "system",

    title:
      "Système",

    description:
      "Suivre automatiquement les préférences de votre appareil.",

    icon:
      Monitor,
  },
];

const PAGE_SIZE_OPTIONS:
  readonly PageSizeOption[] =
[
  {
    value:
      10,

    label:
      "10",
  },

  {
    value:
      20,

    label:
      "20",
  },

  {
    value:
      50,

    label:
      "50",
  },
];

const TECHNICAL_MODE_OPTIONS:
  readonly TechnicalModeOption[] =
[
  {
    value:
      "standard",

    title:
      "Standard",

    description:
      "Afficher uniquement les informations utiles à la consultation courante.",
  },

  {
    value:
      "detailed",

    title:
      "Détaillé",

    description:
      "Afficher également les informations techniques du traitement et de l'IA.",
  },
];

export default function Settings() {
  const shouldReduceMotion =
    useReducedMotion();

  const theme =
    useSettingsStore(
      (
        state,
      ) =>
        state.theme,
    );

  const conversationAutoScroll =
    useSettingsStore(
      (
        state,
      ) =>
        state.conversationAutoScroll,
    );

  const showConversationSources =
    useSettingsStore(
      (
        state,
      ) =>
        state.showConversationSources,
    );

  const documentsPerPage =
    useSettingsStore(
      (
        state,
      ) =>
        state.documentsPerPage,
    );

  const technicalDetailsMode =
    useSettingsStore(
      (
        state,
      ) =>
        state.technicalDetailsMode,
    );

  const setTheme =
    useSettingsStore(
      (
        state,
      ) =>
        state.setTheme,
    );

  const setConversationAutoScroll =
    useSettingsStore(
      (
        state,
      ) =>
        state.setConversationAutoScroll,
    );

  const setShowConversationSources =
    useSettingsStore(
      (
        state,
      ) =>
        state.setShowConversationSources,
    );

  const setDocumentsPerPage =
    useSettingsStore(
      (
        state,
      ) =>
        state.setDocumentsPerPage,
    );

  const setTechnicalDetailsMode =
    useSettingsStore(
      (
        state,
      ) =>
        state.setTechnicalDetailsMode,
    );

  return (
    <DashboardLayout>
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity:
                  0,

                y:
                  16,
              }
        }
        animate={{
          opacity:
            1,

          y:
            0,
        }}
        transition={{
          duration:
            shouldReduceMotion
              ? 0
              : 0.45,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="mx-auto w-full max-w-5xl space-y-6"
      >
        {/* =====================================================
            Apparence
        ===================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Palette
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Apparence
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Personnalisez l'apparence d'IntelliSearch selon votre environnement de travail.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Thème de l'interface
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Votre choix est enregistré automatiquement sur cet appareil.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {THEME_OPTIONS.map(
                (
                  option,
                ) => {
                  const Icon =
                    option.icon;

                  const isSelected =
                    theme ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() => {
                        setTheme(
                          option.value,
                        );
                      }}
                      aria-pressed={
                        isSelected
                      }
                      className={[
                        "group relative rounded-2xl border p-5 text-left transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                        "dark:focus-visible:ring-offset-slate-950",

                        isSelected
                          ? "border-blue-500 bg-blue-50/70 shadow-sm shadow-blue-500/10 dark:border-blue-500 dark:bg-blue-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-800/70",
                      ].join(
                        " ",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={[
                            "flex size-11 items-center justify-center rounded-xl transition-colors",

                            isSelected
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "bg-slate-100 text-slate-500 group-hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200",
                          ].join(
                            " ",
                          )}
                        >
                          <Icon
                            className="size-5"
                            aria-hidden="true"
                          />
                        </span>

                        <SelectionIndicator
                          selected={
                            isSelected
                          }
                        />
                      </div>

                      <p className="mt-5 font-bold text-slate-950 dark:text-white">
                        {
                          option.title
                        }
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {
                          option.description
                        }
                      </p>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            Conversations
        ===================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <ScrollText
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Conversations
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Configurez le comportement de l'assistant documentaire pendant vos conversations.
              </p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
            <SettingsToggle
              title="Scroll automatique"
              description="Descendre automatiquement vers le dernier message lorsqu'une nouvelle réponse est ajoutée."
              checked={
                conversationAutoScroll
              }
              onChange={
                setConversationAutoScroll
              }
            />

            <SettingsToggle
              title="Afficher les sources documentaires"
              description="Afficher les passages documentaires utilisés par le système RAG sous les réponses de l'assistant."
              checked={
                showConversationSources
              }
              onChange={
                setShowConversationSources
              }
            />
          </div>
        </section>

        {/* =====================================================
            Documents
        ===================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
              <FileText
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Documents
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Configurez l'affichage et le niveau de détail des informations documentaires.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6 border-t border-slate-100 pt-6 dark:border-slate-800">
            {/* Pagination */}

            <div>
              <div className="flex items-start gap-3">
                <BookOpenText
                  className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Documents par page
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Choisissez le nombre de documents affichés dans la liste avant pagination.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {PAGE_SIZE_OPTIONS.map(
                  (
                    option,
                  ) => {
                    const isSelected =
                      documentsPerPage ===
                      option.value;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() => {
                          setDocumentsPerPage(
                            option.value,
                          );
                        }}
                        aria-pressed={
                          isSelected
                        }
                        className={[
                          "flex h-11 min-w-20 items-center justify-center rounded-xl border px-4 text-sm font-bold transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",

                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400",
                        ].join(
                          " ",
                        )}
                      >
                        {
                          option.label
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Informations techniques */}

            <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Settings2
                  className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Affichage des informations techniques
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Déterminez le niveau de détail visible dans la fiche d'un document.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {TECHNICAL_MODE_OPTIONS.map(
                  (
                    option,
                  ) => {
                    const isSelected =
                      technicalDetailsMode ===
                      option.value;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() => {
                          setTechnicalDetailsMode(
                            option.value,
                          );
                        }}
                        aria-pressed={
                          isSelected
                        }
                        className={[
                          "rounded-2xl border p-4 text-left transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",

                          isSelected
                            ? "border-blue-500 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-800/70",
                        ].join(
                          " ",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-slate-950 dark:text-white">
                              {
                                option.title
                              }
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                              {
                                option.description
                              }
                            </p>
                          </div>

                          <SelectionIndicator
                            selected={
                              isSelected
                            }
                          />
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </DashboardLayout>
  );
}

interface SettingsToggleProps {
  title: string;
  description: string;
  checked: boolean;

  onChange: (
    checked: boolean,
  ) => void;
}

function SettingsToggle({
  title,
  description,
  checked,
  onChange,
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-5 first:pt-6 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {
            title
          }
        </p>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
          {
            description
          }
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={
          checked
        }
        onClick={() => {
          onChange(
            !checked,
          );
        }}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",

          checked
            ? "bg-blue-600"
            : "bg-slate-200 dark:bg-slate-700",
        ].join(
          " ",
        )}
      >
        <span
          className={[
            "absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform duration-200",

            checked
              ? "translate-x-6"
              : "translate-x-1",
          ].join(
            " ",
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

function SelectionIndicator({
  selected,
}: {
  selected: boolean;
}) {
  return (
    <span
      className={[
        "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border",

        selected
          ? "border-blue-600 bg-blue-600"
          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
      ].join(
        " ",
      )}
      aria-hidden="true"
    >
      {selected ? (
        <span className="size-2 rounded-full bg-white" />
      ) : null}
    </span>
  );
}