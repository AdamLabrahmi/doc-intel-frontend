import {
  useState,
} from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  AlertCircle,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  ChangePasswordDialog,
} from "@/features/profile/components/ChangePasswordDialog";

import {
  ProfileForm,
} from "@/features/profile/components/ProfileForm";

import {
  ProfileOverview,
} from "@/features/profile/components/ProfileOverview";

import {
  useAuthenticatedUserQuery,
} from "@/features/auth/hooks/useAuthenticatedUserQuery";

import {
  useDocumentsQuery,
} from "@/features/documents/hooks/useDocumentsQuery";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

export default function Profile() {
  const shouldReduceMotion =
    useReducedMotion();

  const [
    isChangePasswordDialogOpen,
    setIsChangePasswordDialogOpen,
  ] = useState(false);

  const {
    data: authenticatedUser,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useAuthenticatedUserQuery();

  const {
    data: documents = [],
  } = useDocumentsQuery();

  const completedDocumentsCount =
    documents.filter(
      (document) =>
        document.status ===
        "COMPLETED",
    ).length;

  return (
    <DashboardLayout>
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 20,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration:
            shouldReduceMotion
              ? 0
              : 0.6,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="mx-auto w-full max-w-[1400px] space-y-6"
      >
        <section className="flex flex-col gap-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <UserRound
                className="size-3.5"
                aria-hidden="true"
              />

              Mon espace personnel
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Profil utilisateur
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Gérez vos informations
              personnelles et la sécurité
              de votre compte IntelliSearch.
            </p>
          </div>
        </section>

        {isUserLoading ? (
          <section className="flex min-h-80 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50">
                <LoaderCircle
                  className="size-6 animate-spin text-blue-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Chargement du profil...
              </p>
            </div>
          </section>
        ) : null}

        {isUserError ? (
          <section className="rounded-3xl border border-red-200 bg-red-50/60 p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                <AlertCircle
                  className="size-5 text-red-600"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">
                  Impossible de charger
                  le profil
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {userError instanceof
                  Error
                    ? userError.message
                    : "Une erreur inattendue est survenue."}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {!isUserLoading &&
        !isUserError &&
        authenticatedUser ? (
          <>
            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
              <ProfileOverview
                profile={
                  authenticatedUser
                }
                documentsCount={
                  documents.length
                }
                completedDocumentsCount={
                  completedDocumentsCount
                }
              />

              <ProfileForm
                profile={
                  authenticatedUser
                }
              />
            </div>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <ShieldCheck
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      Sécurité du compte
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Gérez les paramètres
                      de sécurité associés
                      à votre compte.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                      <KeyRound
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <p className="font-bold text-slate-950">
                        Mot de passe
                      </p>

                      <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                        Modifiez votre mot
                        de passe après
                        vérification de votre
                        mot de passe actuel.
                        Cette opération est
                        gérée directement par
                        Keycloak.
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <LockKeyhole
                          className="size-3.5"
                          aria-hidden="true"
                        />

                        Mot de passe non stocké
                        dans IntelliSearch
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsChangePasswordDialogOpen(
                        true,
                      );
                    }}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <KeyRound
                      className="size-4"
                      aria-hidden="true"
                    />

                    Modifier le mot de passe
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <ShieldCheck
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        Protection de votre
                        identité
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Votre ancien mot de
                        passe est vérifié avant
                        toute modification. Votre
                        rôle et vos permissions
                        ne sont pas modifiés par
                        cette opération.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </motion.div>

      <ChangePasswordDialog
        isOpen={
          isChangePasswordDialogOpen
        }
        onClose={() => {
          setIsChangePasswordDialogOpen(
            false,
          );
        }}
      />
    </DashboardLayout>
  );
}