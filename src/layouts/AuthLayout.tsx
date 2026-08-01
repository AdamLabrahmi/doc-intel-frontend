import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  FileSearch2,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

const platformBenefits = [
  {
    title: "Extraction intelligente",
    description: "Analyse automatique avec Apache Tika et Tesseract OCR.",
    icon: ScanLine,
  },
  {
    title: "Documents centralisés",
    description: "Stockage structuré et versionnage automatique.",
    icon: FileSearch2,
  },
  {
    title: "Traitement sécurisé",
    description: "Architecture professionnelle prête pour Keycloak.",
    icon: ShieldCheck,
  },
] as const;

export function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        aria-hidden="true"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, 35, 0],
                y: [0, -25, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-44 top-20 size-[34rem] rounded-full bg-blue-300/30 blur-[130px]"
        aria-hidden="true"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, -30, 0],
                y: [0, 30, 0],
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: 16,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-48 bottom-0 size-[32rem] rounded-full bg-cyan-300/25 blur-[130px]"
        aria-hidden="true"
      />

      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="Retour à l’accueil"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <BrainCircuit
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <span className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-950">
                IntelliSearch
              </span>

              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Intelligent processing
              </span>
            </span>
          </Link>

          <Link
            to="/"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white/70 hover:text-blue-700"
          >
            Retour à l’accueil
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <motion.section
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -35,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="hidden lg:block"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
            <Sparkles
              className="size-4"
              aria-hidden="true"
            />

            Plateforme documentaire intelligente
          </span>

          <h1 className="mt-7 max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-slate-950">
            Accédez à vos documents et à vos{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              données extraites
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Retrouvez vos documents, suivez leurs traitements et consultez les
            contenus générés depuis un espace de travail centralisé.
          </p>

          <div className="mt-10 space-y-4">
            {platformBenefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.article
                  key={benefit.title}
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
                    delay: shouldReduceMotion ? 0 : 0.3 + index * 0.15,
                    duration: shouldReduceMotion ? 0 : 0.55,
                  }}
                  className="flex max-w-xl gap-4 rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      {benefit.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>

                  <CheckCircle2
                    className="ml-auto size-5 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 35,
                  scale: 0.98,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto w-full max-w-lg"
        >
          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 lg:hidden">
                <BrainCircuit
                  className="size-6"
                  aria-hidden="true"
                />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {title}
              </h1>

              <p className="mt-3 leading-7 text-slate-600">
                {description}
              </p>
            </div>

            {children}
          </div>
        </motion.section>
      </main>
    </div>
  );
}