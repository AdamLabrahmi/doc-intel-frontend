import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/registerSchema";

export function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmittingForm(true);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      console.log("Inscription statique :", values);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const renderError = (
    id: string,
    message: string | undefined,
  ) => {
    if (!message) {
      return null;
    }

    return (
      <motion.p
        id={id}
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: -4,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="text-sm font-medium text-red-600"
        role="alert"
      >
        {message}
      </motion.p>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-sm font-semibold text-slate-800"
          >
            Prénom
          </label>

          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Adam"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={
                errors.firstName
                  ? "first-name-error"
                  : undefined
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
              {...register("firstName")}
            />
          </div>

          {renderError(
            "first-name-error",
            errors.firstName?.message,
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="text-sm font-semibold text-slate-800"
          >
            Nom
          </label>

          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Labrahmi"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={
                errors.lastName
                  ? "last-name-error"
                  : undefined
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
              {...register("lastName")}
            />
          </div>

          {renderError(
            "last-name-error",
            errors.lastName?.message,
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="register-email"
          className="text-sm font-semibold text-slate-800"
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
            autoComplete="email"
            placeholder="nom@entreprise.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email
                ? "register-email-error"
                : undefined
            }
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
            {...register("email")}
          />
        </div>

        {renderError(
          "register-email-error",
          errors.email?.message,
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="register-password"
          className="text-sm font-semibold text-slate-800"
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
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Créez un mot de passe sécurisé"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "register-password-error"
                : "password-requirements"
            }
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => {
              setIsPasswordVisible((currentValue) => !currentValue);
            }}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={
              isPasswordVisible
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? (
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

        {errors.password
          ? renderError(
              "register-password-error",
              errors.password.message,
            )
          : (
              <p
                id="password-requirements"
                className="text-xs leading-5 text-slate-500"
              >
                Minimum 8 caractères, avec une majuscule, une minuscule et un
                chiffre.
              </p>
            )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-slate-800"
        >
          Confirmer le mot de passe
        </label>

        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            id="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Saisissez à nouveau le mot de passe"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword
                ? "confirm-password-error"
                : undefined
            }
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
            {...register("confirmPassword")}
          />

          <button
            type="button"
            onClick={() => {
              setIsConfirmPasswordVisible(
                (currentValue) => !currentValue,
              );
            }}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={
              isConfirmPasswordVisible
                ? "Masquer la confirmation du mot de passe"
                : "Afficher la confirmation du mot de passe"
            }
            aria-pressed={isConfirmPasswordVisible}
          >
            {isConfirmPasswordVisible ? (
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

        {renderError(
          "confirm-password-error",
          errors.confirmPassword?.message,
        )}
      </div>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-slate-300 accent-blue-600 focus:ring-blue-500"
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={
              errors.acceptTerms
                ? "accept-terms-error"
                : undefined
            }
            {...register("acceptTerms")}
          />

          <span className="text-sm leading-6 text-slate-600">
            J’accepte les{" "}
            <a
              href="#terms"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              conditions d’utilisation
            </a>{" "}
            et la{" "}
            <a
              href="#privacy"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              politique de confidentialité
            </a>
            .
          </span>
        </label>

        {renderError(
          "accept-terms-error",
          errors.acceptTerms?.message,
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmittingForm}
        className="group h-12 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:pointer-events-none disabled:opacity-70"
      >
        {isSubmittingForm ? (
          <>
            <Loader2
              className="size-4 animate-spin"
              aria-hidden="true"
            />

            Création du compte...
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

      <p className="text-center text-sm text-slate-600">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}