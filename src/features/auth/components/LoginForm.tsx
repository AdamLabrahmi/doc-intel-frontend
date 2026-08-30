import {
  useState,
  type FormEvent,
} from "react";

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
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  createPortal,
} from "react-dom";

import {
  Button,
} from "@/components/ui/button";

import {
  loginWithCredentials,
} from "@/features/auth/api/login.api";

import {
  saveAuthTokens,
} from "@/features/auth/services/auth-token-storage.service";

import {
  ROUTES,
} from "@/routes/routePaths";

export function LoginForm() {
  const shouldReduceMotion =
    useReducedMotion();

  const [
    isLoginModalOpen,
    setIsLoginModalOpen,
  ] = useState(false);

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    loginError,
    setLoginError,
  ] =
    useState<string | null>(
      null,
    );

  const openLoginModal = () => {
    setLoginError(null);
    setIsLoginModalOpen(true);

    document.body.style.overflow =
      "hidden";
  };

  const closeLoginModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsLoginModalOpen(false);

    setLoginError(null);

    setPassword("");

    document.body.style.overflow =
      "";
  };

  const validateForm = () => {
    if (!username.trim()) {
      setLoginError(
        "Veuillez saisir votre nom d’utilisateur ou votre adresse e-mail.",
      );

      return false;
    }

    if (!password.trim()) {
      setLoginError(
        "Veuillez saisir votre mot de passe.",
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

      setLoginError(null);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const response =
          await loginWithCredentials({
            username:
              username.trim(),
            password,
          });

        saveAuthTokens({
          accessToken:
            response.access_token,

          refreshToken:
            response.refresh_token,

          idToken:
            response.id_token,
        });

        document.body.style.overflow =
          "";

        window.location.assign(
          ROUTES.dashboard,
        );
      } catch (error) {
        console.error(
          "Échec de la connexion.",
          error,
        );

        if (
          error instanceof Error
        ) {
          setLoginError(
            error.message,
          );
        } else {
          setLoginError(
            "Impossible de vous connecter. Veuillez réessayer.",
          );
        }

        setIsSubmitting(false);
      }
    };

  const loginModal =
    typeof document !==
      "undefined" &&
    isLoginModalOpen
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
              {/* Overlay global */}
              <button
                type="button"
                onClick={
                  closeLoginModal
                }
                disabled={
                  isSubmitting
                }
                aria-label="Fermer la fenêtre de connexion"
                className="absolute inset-0 h-full w-full cursor-default bg-slate-950/35 backdrop-blur-md"
              />

              {/* Modal réellement centrée sur le viewport */}
              <div className="relative flex min-h-screen w-full items-center justify-center overflow-y-auto p-4 sm:p-6">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="login-dialog-title"
                  aria-describedby="login-dialog-description"
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
                    scale: 0.97,
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
                  onClick={(
                    event,
                  ) => {
                    event.stopPropagation();
                  }}
                  className="relative my-auto w-full max-w-[460px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_35px_100px_-25px_rgba(15,23,42,0.50)] backdrop-blur-xl sm:p-8"
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
                      closeLoginModal
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
                        id="login-dialog-title"
                        className="text-2xl font-bold tracking-tight text-slate-950"
                      >
                        Connexion
                      </h2>

                      <p
                        id="login-dialog-description"
                        className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500"
                      >
                        Saisissez vos
                        identifiants pour
                        accéder à votre
                        espace IntelliSearch.
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
                            Authentification
                            Keycloak
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Les identifiants
                            sont transmis à
                            Keycloak afin de
                            générer votre
                            session sécurisée.
                          </p>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {loginError ? (
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
                            loginError
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
                      <div>
                        <label
                          htmlFor="login-username"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Nom d’utilisateur
                          ou e-mail
                        </label>

                        <div className="relative">
                          <UserRound
                            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                            aria-hidden="true"
                          />

                          <input
                            id="login-username"
                            name="username"
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

                              if (
                                loginError
                              ) {
                                setLoginError(
                                  null,
                                );
                              }
                            }}
                            disabled={
                              isSubmitting
                            }
                            autoComplete="username"
                            autoFocus
                            placeholder="nom@exemple.com"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label
                            htmlFor="login-password"
                            className="text-sm font-semibold text-slate-700"
                          >
                            Mot de passe
                          </label>

                          <Link
                            to={
                              ROUTES.forgotPassword
                            }
                            onClick={() => {
                              setIsLoginModalOpen(
                                false,
                              );

                              document.body.style.overflow =
                                "";
                            }}
                            className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                          >
                            Mot de passe
                            oublié ?
                          </Link>
                        </div>

                        <div className="relative">
                          <LockKeyhole
                            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                            aria-hidden="true"
                          />

                          <input
                            id="login-password"
                            name="password"
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

                              if (
                                loginError
                              ) {
                                setLoginError(
                                  null,
                                );
                              }
                            }}
                            disabled={
                              isSubmitting
                            }
                            autoComplete="current-password"
                            placeholder="Votre mot de passe"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                            disabled={
                              isSubmitting
                            }
                            className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none"
                            aria-label={
                              showPassword
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                            }
                          >
                            {showPassword ? (
                              <EyeOff
                                className="size-4"
                                aria-hidden="true"
                              />
                            ) : (
                              <Eye
                                className="size-4"
                                aria-hidden="true"
                              />
                            )}
                          </button>
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

                            Connexion
                            en cours...
                          </>
                        ) : (
                          <>
                            Se connecter

                            <ArrowRight
                              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                      Vous n’avez pas
                      encore de compte ?{" "}

                      <Link
                        to={
                          ROUTES.register
                        }
                        onClick={() => {
                          setIsLoginModalOpen(
                            false,
                          );

                          document.body.style.overflow =
                            "";
                        }}
                        className="font-bold text-blue-600 transition-colors hover:text-blue-700"
                      >
                        Créer un compte
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
                Connexion sécurisée
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                L’authentification
                est assurée par
                Keycloak et les
                accès à IntelliSearch
                sont protégés par
                des jetons JWT.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={
            openLoginModal
          }
          className="group h-12 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25"
        >
          Se connecter

          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Button>

        <p className="text-center text-sm text-slate-600">
          Vous n’avez pas encore de compte ?{" "}

          <Link
            to={
              ROUTES.register
            }
            className="font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            Créer un compte
          </Link>
        </p>
      </div>

      {loginModal}
    </>
  );
}