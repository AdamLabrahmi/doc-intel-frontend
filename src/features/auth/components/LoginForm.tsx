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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmittingForm(true);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      console.log("Connexion statique :", values);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
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
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nom@entreprise.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email
                ? "email-error"
                : undefined
            }
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
            {...register("email")}
          />
        </div>

        {errors.email && (
          <motion.p
            id="email-error"
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
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-800"
          >
            Mot de passe
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Saisissez votre mot de passe"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "password-error"
                : undefined
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

        {errors.password && (
          <motion.p
            id="password-error"
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
            {errors.password.message}
          </motion.p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 accent-blue-600 focus:ring-blue-500"
          {...register("rememberMe")}
        />

        <span className="text-sm leading-6 text-slate-600">
          Garder ma session active sur cet appareil
        </span>
      </label>

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

            Connexion en cours...
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

      <p className="text-center text-sm text-slate-600">
        Vous n’avez pas encore de compte ?{" "}
        <Link
          to="/register"
          className="font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Créer un compte
        </Link>
      </p>
    </form>
  );
}