import {
  useState,
  type FormEvent,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Button,
} from "@/components/ui/button";

import {
  registerUser,
} from "@/features/auth/api/register.api";

import {
  ROUTES,
} from "@/routes/routePaths";

export function RegisterForm() {
  const navigate =
    useNavigate();

  const shouldReduceMotion =
    useReducedMotion();

  const [
    isRegisterModalOpen,
    setIsRegisterModalOpen,
  ] = useState(false);

  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    registerError,
    setRegisterError,
  ] =
    useState<string | null>(
      null,
    );

  const openRegisterModal = () => {
    setRegisterError(null);

    setIsRegisterModalOpen(
      true,
    );

    document.body.style.overflow =
      "hidden";
  };

  const closeRegisterModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsRegisterModalOpen(
      false,
    );

    setRegisterError(null);

    setPassword("");
    setConfirmPassword("");

    document.body.style.overflow =
      "";
  };

  const validateForm = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setRegisterError(
        "Veuillez renseigner tous les champs.",
      );

      return false;
    }

    if (
      !email.includes("@")
    ) {
      setRegisterError(
        "Veuillez saisir une adresse e-mail valide.",
      );

      return false;
    }

    if (
      password.length < 8
    ) {
      setRegisterError(
        "Le mot de passe doit contenir au moins 8 caractères.",
      );

      return false;
    }

    if (
      password !==
      confirmPassword
    ) {
      setRegisterError(
        "Les mots de passe ne correspondent pas.",
      );

      return false;
    }

    return true;
  };

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setRegisterError(null);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await registerUser({
          firstName:
            firstName.trim(),

          lastName:
            lastName.trim(),

          username:
            username.trim(),

          email:
            email.trim(),

          password,
        });

        document.body.style.overflow =
          "";

        navigate(
          ROUTES.login,
          {
            replace: true,
          },
        );
      } catch (error) {
        console.error(
          "Échec de la création du compte.",
          error,
        );

        setRegisterError(
          error instanceof Error
            ? error.message
            : "Impossible de créer votre compte. Veuillez réessayer.",
        );

        setIsSubmitting(false);
      }
    };

  const registerModal =
    typeof document !==
      "undefined" &&
    isRegisterModalOpen
      ? createPortal(
          <AnimatePresence>
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration:
                  shouldReduceMotion
                    ? 0
                    : 0.25,
              }}
              className="fixed inset-0 z-[9999]"
            >
              {/* Overlay */}
              <button
                type="button"
                onClick={
                  closeRegisterModal
                }
                disabled={
                  isSubmitting
                }
                aria-label="Fermer la fenêtre d'inscription"
                className="absolute inset-0 h-full w-full cursor-default bg-slate-950/35 backdrop-blur-md"
              />

              {/* Modal centrée sur tout le viewport */}
              <div className="relative flex min-h-screen w-full items-center justify-center overflow-y-auto p-4 sm:p-6">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="register-dialog-title"
                  aria-describedby="register-dialog-description"
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 24,
                          scale:
                            0.96,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 16,
                    scale:
                      0.97,
                  }}
                  transition={{
                    duration:
                      shouldReduceMotion
                        ? 0
                        : 0.35,

                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="relative my-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_35px_100px_-25px_rgba(15,23,42,0.50)] backdrop-blur-xl sm:p-8"
                >
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 size-52 rounded-full bg-blue-300/25 blur-3xl"
                    aria-hidden="true"
                  />

                  <div
                    className="pointer-events-none absolute -bottom-24 -left-24 size-48 rounded-full bg-cyan-300/20 blur-3xl"
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={
                      closeRegisterModal
                    }
                    disabled={
                      isSubmitting
                    }
                    className="absolute right-5 top-5 z-20 flex size-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Fermer"
                  >
                    <X
                      className="size-4"
                      aria-hidden="true"
                    />
                  </button>

                  <div className="relative z-10">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25">
                      <BrainCircuit
                        className="size-6"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="mt-5 text-center">
                      <h2
                        id="register-dialog-title"
                        className="text-2xl font-bold tracking-tight text-slate-950"
                      >
                        Créer votre compte
                      </h2>

                      <p
                        id="register-dialog-description"
                        className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500"
                      >
                        Renseignez vos informations pour
                        rejoindre IntelliSearch.
                      </p>
                    </div>

                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5">
                      <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                          <ShieldCheck
                            className="size-4"
                            aria-hidden="true"
                          />
                        </span>

                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Compte sécurisé
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Votre identité sera enregistrée
                            dans Keycloak et votre compte
                            recevra les droits utilisateur
                            prévus par la plateforme.
                          </p>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {registerError ? (
                        <motion.div
                          initial={
                            shouldReduceMotion
                              ? false
                              : {
                                  opacity:
                                    0,
                                  y: -8,
                                }
                          }
                          animate={{
                            opacity:
                              1,
                            y: 0,
                          }}
                          exit={{
                            opacity:
                              0,
                            y: -5,
                          }}
                          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700"
                          role="alert"
                        >
                          {
                            registerError
                          }
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <form
                      onSubmit={
                        handleSubmit
                      }
                      className="mt-6 space-y-5"
                    >
                      {/* Prénom + Nom */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="register-first-name"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Prénom
                          </label>

                          <div className="relative">
                            <User
                              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                              aria-hidden="true"
                            />

                            <input
                              id="register-first-name"
                              type="text"
                              value={
                                firstName
                              }
                              onChange={(
                                event,
                              ) => {
                                setFirstName(
                                  event
                                    .target
                                    .value,
                                );

                                setRegisterError(
                                  null,
                                );
                              }}
                              disabled={
                                isSubmitting
                              }
                              autoComplete="given-name"
                              placeholder="Prénom"
                              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="register-last-name"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Nom
                          </label>

                          <div className="relative">
                            <User
                              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                              aria-hidden="true"
                            />

                            <input
                              id="register-last-name"
                              type="text"
                              value={
                                lastName
                              }
                              onChange={(
                                event,
                              ) => {
                                setLastName(
                                  event
                                    .target
                                    .value,
                                );

                                setRegisterError(
                                  null,
                                );
                              }}
                              disabled={
                                isSubmitting
                              }
                              autoComplete="family-name"
                              placeholder="Nom"
                              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Username */}
                      <div>
                        <label
                          htmlFor="register-username"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Nom d’utilisateur
                        </label>

                        <div className="relative">
                          <UserPlus
                            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                            aria-hidden="true"
                          />

                          <input
                            id="register-username"
                            type="text"
                            value={
                              username
                            }
                            onChange={(
                              event,
                            ) => {
                              setUsername(
                                event
                                  .target
                                  .value,
                              );

                              setRegisterError(
                                null,
                              );
                            }}
                            disabled={
                              isSubmitting
                            }
                            autoComplete="username"
                            placeholder="Votre nom d’utilisateur"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="register-email"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Adresse e-mail
                        </label>

                        <div className="relative">
                          <Mail
                            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                            aria-hidden="true"
                          />

                          <input
                            id="register-email"
                            type="email"
                            value={
                              email
                            }
                            onChange={(
                              event,
                            ) => {
                              setEmail(
                                event
                                  .target
                                  .value,
                              );

                              setRegisterError(
                                null,
                              );
                            }}
                            disabled={
                              isSubmitting
                            }
                            autoComplete="email"
                            placeholder="nom@exemple.com"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                          />
                        </div>
                      </div>

                      {/* Password + confirmation */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="register-password"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Mot de passe
                          </label>

                          <div className="relative">
                            <LockKeyhole
                              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                              aria-hidden="true"
                            />

                            <input
                              id="register-password"
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              value={
                                password
                              }
                              onChange={(
                                event,
                              ) => {
                                setPassword(
                                  event
                                    .target
                                    .value,
                                );

                                setRegisterError(
                                  null,
                                );
                              }}
                              disabled={
                                isSubmitting
                              }
                              autoComplete="new-password"
                              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-slate-950 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                setShowPassword(
                                  (
                                    current,
                                  ) =>
                                    !current,
                                );
                              }}
                              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              aria-label={
                                showPassword
                                  ? "Masquer le mot de passe"
                                  : "Afficher le mot de passe"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="register-confirm-password"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Confirmation
                          </label>

                          <div className="relative">
                            <LockKeyhole
                              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                              aria-hidden="true"
                            />

                            <input
                              id="register-confirm-password"
                              type={
                                showConfirmPassword
                                  ? "text"
                                  : "password"
                              }
                              value={
                                confirmPassword
                              }
                              onChange={(
                                event,
                              ) => {
                                setConfirmPassword(
                                  event
                                    .target
                                    .value,
                                );

                                setRegisterError(
                                  null,
                                );
                              }}
                              disabled={
                                isSubmitting
                              }
                              autoComplete="new-password"
                              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-slate-950 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                setShowConfirmPassword(
                                  (
                                    current,
                                  ) =>
                                    !current,
                                );
                              }}
                              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={
                          isSubmitting
                        }
                        className="group h-12 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:pointer-events-none disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2
                              className="size-4 animate-spin"
                              aria-hidden="true"
                            />

                            Création en cours...
                          </>
                        ) : (
                          <>
                            Créer mon compte

                            <ArrowRight
                              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                      Vous avez déjà un compte ?{" "}

                      <Link
                        to={
                          ROUTES.login
                        }
                        onClick={() => {
                          document.body.style.overflow =
                            "";
                        }}
                        className="font-bold text-blue-600 transition-colors hover:text-blue-700"
                      >
                        Se connecter
                      </Link>
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <ShieldCheck
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Inscription sécurisée
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Votre identité sera gérée
                par Keycloak afin de sécuriser
                l’accès à IntelliSearch.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <UserPlus
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Créer votre compte
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Renseignez vos informations
                personnelles et choisissez votre
                mot de passe.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={
            openRegisterModal
          }
          className="group h-12 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25"
        >
          Continuer l'inscription

          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Button>

        <p className="text-center text-sm text-slate-600">
          Vous avez déjà un compte ?{" "}

          <Link
            to={
              ROUTES.login
            }
            className="font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            Se connecter
          </Link>
        </p>
      </div>

      {registerModal}
    </>
  );
}