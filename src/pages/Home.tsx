import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Database,
  FileCheck2,
  Files,
  FileText,
  Languages,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";

import { PublicNavbar } from "@/components/navigation/PublicNavbar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const extractedFields = [
  {
    label: "Type de document",
    value: "Facture fournisseur",
  },
  {
    label: "Référence",
    value: "FACT-2026-00842",
  },
  {
    label: "Date",
    value: "31 juillet 2026",
  },
  {
    label: "Montant total",
    value: "14 580,00 MAD",
  },
] as const;

const features = [
  {
    title: "Traitement par lots",
    description:
      "Importez plusieurs documents simultanément et laissez le moteur asynchrone orchestrer leur traitement en arrière-plan.",
    icon: Files,
  },
  {
    title: "Extraction intelligente",
    description:
      "Combinez Apache Tika et Tesseract OCR pour extraire le texte des documents digitaux et des fichiers numérisés.",
    icon: ScanLine,
  },
  {
    title: "Versionnage automatique",
    description:
      "Conservez l’historique des différentes versions d’un même document sans perdre les fichiers précédents.",
    icon: FileCheck2,
  },
  {
    title: "Stockage sécurisé",
    description:
      "Centralisez les documents originaux et les fichiers générés dans un stockage objet MinIO structuré.",
    icon: ShieldCheck,
  },
  {
    title: "Traitement asynchrone",
    description:
      "Les tâches longues sont exécutées avec JobRunr afin de préserver les performances et la disponibilité de l’application.",
    icon: Zap,
  },
  {
    title: "Prêt pour l’IA",
    description:
      "Une architecture préparée pour enrichir progressivement les documents avec LangChain4j et des modèles de langage.",
    icon: BrainCircuit,
  },
] as const;

const processSteps = [
  {
    number: "01",
    title: "Import du document",
    description:
      "L’utilisateur sélectionne un ou plusieurs documents depuis une interface simple et contrôlée.",
    icon: UploadCloud,
  },
  {
    number: "02",
    title: "Extraction automatique",
    description:
      "La plateforme sélectionne le moteur adapté, puis extrait le texte, la langue et les métadonnées.",
    icon: ScanLine,
  },
  {
    number: "03",
    title: "Structuration du contenu",
    description:
      "Le contenu obtenu est transformé en Markdown et organisé pour faciliter son exploitation.",
    icon: FileText,
  },
  {
    number: "04",
    title: "Stockage et consultation",
    description:
      "Les données et les fichiers générés sont conservés pour être consultés depuis le futur dashboard.",
    icon: Database,
  },
] as const;

const technologies = [
  "Spring Boot",
  "PostgreSQL",
  "MinIO",
  "Apache Tika",
  "Tesseract OCR",
  "JobRunr",
  "React",
  "TypeScript",
] as const;

const heroAdvantages = [
  "Import multiple",
  "OCR automatique",
  "Versionnage intégré",
] as const;

const processingPreviewSteps = [
  {
    label: "Upload",
    icon: UploadCloud,
  },
  {
    label: "Tika / OCR",
    icon: ScanLine,
  },
  {
    label: "Markdown",
    icon: FileCheck2,
  },
] as const;

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-950 selection:bg-blue-200 selection:text-blue-950">
      <PublicNavbar />

      <main className="w-full">
        <section className="relative isolate flex min-h-screen w-full items-center overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32">
          <div
            className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#eff6ff_100%)]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute inset-0 -z-20 opacity-50 [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
            aria-hidden="true"
          />

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.08, 1],
                  }
            }
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -left-40 top-32 -z-10 size-[32rem] rounded-full bg-blue-300/30 blur-[120px]"
            aria-hidden="true"
          />

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, -25, 0],
                    y: [0, 25, 0],
                    scale: [1, 1.1, 1],
                  }
            }
            transition={{
              duration: 14,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-36 top-14 -z-10 size-[30rem] rounded-full bg-cyan-300/25 blur-[120px]"
            aria-hidden="true"
          />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-50" />

                    <span className="relative inline-flex size-2 rounded-full bg-blue-600" />
                  </span>

                  Plateforme intelligente de traitement documentaire
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mt-7 text-balance text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[4.25rem]"
              >
                Transformez vos documents en{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    données exploitables
                  </span>

                  <motion.span
                    initial={
                      shouldReduceMotion
                        ? {
                            scaleX: 1,
                          }
                        : {
                            scaleX: 0,
                          }
                    }
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : 1,
                      duration: shouldReduceMotion ? 0 : 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-x-0 bottom-1 -z-0 h-3 origin-left rounded-full bg-blue-100 sm:h-4"
                    aria-hidden="true"
                  />
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-7 max-w-2xl text-pretty text-base leading-8 text-slate-600 sm:text-lg"
              >
                Importez, analysez et structurez automatiquement vos documents
                digitaux grâce à une chaîne de traitement combinant extraction
                de texte, OCR, versionnage et traitement asynchrone.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  to="/register"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),
                    "group h-13 rounded-xl bg-blue-600 px-7 font-semibold shadow-xl shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/25",
                  )}
                >
                  Commencer gratuitement

                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                <a
                  href="#process"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    }),
                    "h-13 rounded-xl border-slate-300 bg-white/70 px-7 font-semibold text-slate-800 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
                  )}
                >
                  Découvrir le fonctionnement
                </a>
              </motion.div>

              <motion.ul
                variants={itemVariants}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
                aria-label="Avantages de la plateforme"
              >
                {heroAdvantages.map((advantage) => (
                  <li
                    key={advantage}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <CheckCircle2
                      className="size-4 text-emerald-500"
                      aria-hidden="true"
                    />

                    {advantage}
                  </li>
                ))}
              </motion.ul>

              <motion.div
                variants={itemVariants}
                className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-7 sm:gap-6"
              >
                <div>
                  <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                    20+
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Formats traités
                  </p>
                </div>

                <div className="border-l border-slate-200 pl-4 sm:pl-6">
                  <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                    Batch
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Import multiple
                  </p>
                </div>

                <div className="border-l border-slate-200 pl-4 sm:pl-6">
                  <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                    Async
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Traitement JobRunr
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: 45,
                      scale: 0.96,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.35,
                duration: shouldReduceMotion ? 0 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div
                className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-blue-500/15 via-transparent to-cyan-400/20 blur-2xl"
                aria-hidden="true"
              />

              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, -8, 0],
                      }
                }
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="relative rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_35px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5"
              >
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText
                          className="size-5"
                          aria-hidden="true"
                        />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          facture-fournisseur.pdf
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          2,4 Mo · PDF
                        </p>
                      </div>
                    </div>

                    <span className="ml-3 flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2
                        className="size-3.5"
                        aria-hidden="true"
                      />

                      Traité
                    </span>
                  </div>

                  <div className="space-y-5 p-5 sm:p-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ScanLine
                            className="size-4 text-blue-600"
                            aria-hidden="true"
                          />

                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                            Analyse documentaire
                          </span>
                        </div>

                        <span className="text-xs font-bold text-blue-600">
                          100 %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                          initial={{
                            width: shouldReduceMotion ? "100%" : "0%",
                          }}
                          animate={{
                            width: "100%",
                          }}
                          transition={{
                            delay: shouldReduceMotion ? 0 : 1,
                            duration: shouldReduceMotion ? 0 : 1.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        {processingPreviewSteps.map((step, index) => {
                          const Icon = step.icon;

                          return (
                            <motion.div
                              key={step.label}
                              initial={
                                shouldReduceMotion
                                  ? false
                                  : {
                                      opacity: 0,
                                      y: 10,
                                    }
                              }
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                delay: shouldReduceMotion
                                  ? 0
                                  : 1.1 + index * 0.18,
                                duration: shouldReduceMotion ? 0 : 0.4,
                              }}
                              className="rounded-xl bg-white px-2 py-3 shadow-sm"
                            >
                              <Icon
                                className="mx-auto size-4 text-blue-600"
                                aria-hidden="true"
                              />

                              <p className="mt-1.5 text-[10px] font-semibold text-slate-600">
                                {step.label}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {extractedFields.map((field, index) => (
                        <motion.div
                          key={field.label}
                          initial={
                            shouldReduceMotion
                              ? false
                              : {
                                  opacity: 0,
                                  x: 18,
                                }
                          }
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay: shouldReduceMotion
                              ? 0
                              : 1.35 + index * 0.15,
                            duration: shouldReduceMotion ? 0 : 0.45,
                          }}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                        >
                          <div>
                            <p className="text-xs text-slate-500">
                              {field.label}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {field.value}
                            </p>
                          </div>

                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                        <Languages
                          className="size-3.5"
                          aria-hidden="true"
                        />

                        Français détecté
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                        <Sparkles
                          className="size-3.5"
                          aria-hidden="true"
                        />

                        Texte structuré
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 0.8,
                        x: -20,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 1.7,
                  duration: shouldReduceMotion ? 0 : 0.6,
                }}
                className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur sm:flex lg:-left-10"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-xs text-slate-500">
                    Extraction terminée
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    Document disponible
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.a
            href="#features"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                  }
            }
            animate={{
              opacity: 1,
              y: shouldReduceMotion ? 0 : [0, 8, 0],
            }}
            transition={{
              opacity: {
                delay: shouldReduceMotion ? 0 : 1.8,
                duration: shouldReduceMotion ? 0 : 0.5,
              },
              y: {
                delay: shouldReduceMotion ? 0 : 2,
                duration: shouldReduceMotion ? 0 : 1.8,
                repeat: shouldReduceMotion
                  ? 0
                  : Number.POSITIVE_INFINITY,
              },
            }}
            className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-slate-400 transition-colors hover:text-blue-600 xl:block"
            aria-label="Découvrir les fonctionnalités"
          >
            <ChevronDown
              className="size-7"
              aria-hidden="true"
            />
          </motion.a>
        </section>

        <section
          id="features"
          className="scroll-mt-20 border-y border-slate-200 bg-slate-50 py-20 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 25,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.7,
              }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                Fonctionnalités
              </span>

              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Une chaîne de traitement documentaire complète
              </h2>

              <p className="mt-5 text-pretty leading-8 text-slate-600">
                Chaque étape est isolée dans une architecture modulaire afin de
                garantir la maintenabilité, la résilience et l’évolution future
                de la plateforme.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    variants={cardVariants}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -8,
                          }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.25,
                    }}
                  >
                    <Card className="group h-full rounded-3xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5">
                      <CardHeader className="p-7">
                        <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:rotate-3 group-hover:bg-blue-600 group-hover:text-white">
                          <Icon
                            className="size-5"
                            aria-hidden="true"
                          />
                        </span>

                        <CardTitle className="text-xl text-slate-950">
                          {feature.title}
                        </CardTitle>

                        <CardDescription className="mt-2 text-sm leading-7 text-slate-600">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section
          id="process"
          className="relative scroll-mt-20 overflow-hidden bg-white py-20 sm:py-28"
        >
          <div
            className="absolute -right-52 top-10 size-[28rem] rounded-full bg-blue-100/60 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-12">
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -30,
                    }
              }
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.7,
              }}
            >
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                Fonctionnement
              </span>

              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Du fichier brut au contenu exploitable
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Le traitement est organisé en étapes indépendantes. Chaque
                composant peut évoluer sans remettre en cause l’ensemble de la
                plateforme.
              </p>

              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <div className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Zap
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <p className="font-bold text-slate-950">
                      Traitement non bloquant
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Les opérations longues sont exécutées en arrière-plan avec
                      JobRunr.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              className="relative space-y-4"
            >
              <div
                className="absolute bottom-10 left-7 top-10 hidden w-px bg-gradient-to-b from-blue-200 via-blue-400 to-blue-100 sm:block"
                aria-hidden="true"
              />

              {processSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.number}
                    variants={itemVariants}
                    className="group relative flex gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-6"
                  >
                    <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105">
                      <Icon
                        className="size-6"
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                        Étape {step.number}
                      </span>

                      <h3 className="mt-1.5 text-lg font-bold text-slate-950">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section
          id="technologies"
          className="scroll-mt-20 border-y border-slate-200 bg-slate-950 py-20 text-white sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 25,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.7,
              }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
                Architecture moderne
              </span>

              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Des technologies robustes et adaptées à l’entreprise
              </h2>

              <p className="mt-5 leading-8 text-slate-400">
                Une combinaison de technologies backend et frontend choisies
                pour leur maintenabilité, leurs performances et leur capacité à
                évoluer.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              {technologies.map((technology) => (
                <motion.span
                  key={technology}
                  variants={itemVariants}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -4,
                          scale: 1.03,
                        }
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 shadow-lg"
                >
                  {technology}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 35,
                      scale: 0.98,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.75,
              }}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-6 py-14 text-center text-white shadow-2xl shadow-blue-600/20 sm:px-12 sm:py-16"
            >
              <div
                className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:38px_38px]"
                aria-hidden="true"
              />

              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        x: [0, 25, 0],
                        y: [0, -15, 0],
                      }
                }
                transition={{
                  duration: 9,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -right-20 -top-24 size-72 rounded-full bg-white/20 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative mx-auto max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
                  <Sparkles
                    className="size-4"
                    aria-hidden="true"
                  />

                  Commencez votre expérience documentaire
                </span>

                <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Centralisez et exploitez vos documents plus efficacement
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-pretty leading-8 text-blue-50">
                  Créez votre espace et découvrez progressivement une nouvelle
                  manière de gérer les documents digitaux.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className={cn(
                      buttonVariants({
                        size: "lg",
                      }),
                      "group h-13 rounded-xl bg-white px-7 font-semibold text-blue-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50",
                    )}
                  >
                    Créer un compte

                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>

                  <Link
                    to="/login"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "lg",
                      }),
                      "h-13 rounded-xl border-white/35 bg-white/10 px-7 font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white",
                    )}
                  >
                    Accéder à mon espace
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Link
            to="/"
            className="flex items-center gap-3 font-bold text-slate-950"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BrainCircuit
                className="size-4"
                aria-hidden="true"
              />
            </span>

            IntelliSearch
          </Link>

          <p className="text-sm text-slate-500">
            Solution intelligente d’extraction de données documentaires.
          </p>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} IntelliSearch
          </p>
        </div>
      </footer>
    </div>
  );
}