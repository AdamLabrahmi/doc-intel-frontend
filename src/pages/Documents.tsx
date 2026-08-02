import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  CircleAlert,
  Files,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { DocumentsTable } from "@/features/documents/components/DocumentsTable";
import { documentsMock } from "@/features/documents/data/documents.mock";
import type { DocumentStatus } from "@/features/documents/types/document.types";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

type StatusFilter = "ALL" | DocumentStatus;

const statusFilterOptions: readonly {
  label: string;
  value: StatusFilter;
}[] = [
  {
    label: "Tous les statuts",
    value: "ALL",
  },
  {
    label: "Terminés",
    value: "COMPLETED",
  },
  {
    label: "En cours",
    value: "PROCESSING",
  },
  {
    label: "En attente",
    value: "PENDING",
  },
  {
    label: "Échecs",
    value: "FAILED",
  },
] as const;

export default function Documents() {
  const shouldReduceMotion = useReducedMotion();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const filteredDocuments = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return documentsMock.filter((document) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        document.fileName.toLowerCase().includes(normalizedSearchTerm) ||
        document.fileType.toLowerCase().includes(normalizedSearchTerm) ||
        document.language.toLowerCase().includes(normalizedSearchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        document.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const completedCount = documentsMock.filter(
    (document) => document.status === "COMPLETED",
  ).length;

  const failedCount = documentsMock.filter(
    (document) => document.status === "FAILED",
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
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto w-full max-w-[1600px] space-y-6"
      >
        <section className="flex flex-col gap-5 rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Files
                className="size-3.5"
                aria-hidden="true"
              />

              Bibliothèque documentaire
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Documents
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Consultez les fichiers importés, leur version, la méthode
              d’extraction utilisée et l’état de leur traitement.
            </p>
          </div>

          <Link
            to={ROUTES.documentUpload}
            className={cn(
              buttonVariants({
                size: "lg",
              }),
              "group h-12 shrink-0 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
            )}
          >
            <Plus
              className="size-4"
              aria-hidden="true"
            />

            Importer des documents
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total des documents
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {documentsMock.length}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Traitements terminés
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {completedCount}
                </p>
              </div>

              <CheckCircle2
                className="size-6 text-emerald-600"
                aria-hidden="true"
              />
            </div>
          </article>

          <article className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Traitements échoués
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {failedCount}
                </p>
              </div>

              <CircleAlert
                className="size-6 text-red-600"
                aria-hidden="true"
              />
            </div>
          </article>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              placeholder="Rechercher par nom, type ou langue..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="relative min-w-56">
            <Filter
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
              }}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              aria-label="Filtrer les documents par statut"
            >
              {statusFilterOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {filteredDocuments.length} résultat
            {filteredDocuments.length > 1 ? "s" : ""}
          </p>
        </section>

        <DocumentsTable documents={filteredDocuments} />
      </motion.div>
    </DashboardLayout>
  );
}