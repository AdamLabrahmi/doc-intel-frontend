import type { LucideIcon } from "lucide-react";
import {
  CircleAlert,
  Clock3,
  FileCheck2,
  Files,
} from "lucide-react";

export type DashboardStatTone =
  | "blue"
  | "emerald"
  | "amber"
  | "red";

export interface DashboardStat {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon: LucideIcon;
  tone: DashboardStatTone;
}

export interface ProcessingEvolutionPoint {
  day: string;
  documents: number;
  completed: number;
}

export interface ExtractionDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface RecentDocument {
  id: number;
  fileName: string;
  type: string;
  size: string;
  extractionMethod: "Tika" | "OCR";
  status: "Terminé" | "En cours" | "En attente" | "Échec";
  processedAt: string;
}

export interface DashboardNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "success" | "warning" | "info";
}

export const dashboardStats: readonly DashboardStat[] = [
  {
    title: "Documents importés",
    value: "1 248",
    description: "Documents enregistrés",
    trend: "+12 % ce mois",
    icon: Files,
    tone: "blue",
  },
  {
    title: "Traitements terminés",
    value: "1 172",
    description: "Extraction terminée",
    trend: "93,9 % de réussite",
    icon: FileCheck2,
    tone: "emerald",
  },
  {
    title: "En attente",
    value: "54",
    description: "Dans la file JobRunr",
    trend: "Temps moyen : 42 s",
    icon: Clock3,
    tone: "amber",
  },
  {
    title: "Traitements échoués",
    value: "22",
    description: "Documents à vérifier",
    trend: "1,8 % du total",
    icon: CircleAlert,
    tone: "red",
  },
] as const;

export const processingEvolutionData: readonly ProcessingEvolutionPoint[] = [
  {
    day: "Lun",
    documents: 132,
    completed: 124,
  },
  {
    day: "Mar",
    documents: 168,
    completed: 158,
  },
  {
    day: "Mer",
    documents: 142,
    completed: 134,
  },
  {
    day: "Jeu",
    documents: 190,
    completed: 181,
  },
  {
    day: "Ven",
    documents: 224,
    completed: 210,
  },
  {
    day: "Sam",
    documents: 118,
    completed: 110,
  },
  {
    day: "Dim",
    documents: 154,
    completed: 147,
  },
] as const;

export const extractionDistributionData: readonly ExtractionDistributionPoint[] =
  [
    {
      name: "Apache Tika",
      value: 72,
      color: "#2563EB",
    },
    {
      name: "Tesseract OCR",
      value: 28,
      color: "#06B6D4",
    },
  ] as const;

export const recentDocuments: readonly RecentDocument[] = [
  {
    id: 1,
    fileName: "facture-fournisseur-juillet.pdf",
    type: "PDF",
    size: "2,4 Mo",
    extractionMethod: "Tika",
    status: "Terminé",
    processedAt: "Il y a 4 min",
  },
  {
    id: 2,
    fileName: "contrat-location-scan.pdf",
    type: "PDF scanné",
    size: "5,8 Mo",
    extractionMethod: "OCR",
    status: "En cours",
    processedAt: "Il y a 9 min",
  },
  {
    id: 3,
    fileName: "rapport-financier-2025.docx",
    type: "DOCX",
    size: "1,7 Mo",
    extractionMethod: "Tika",
    status: "Terminé",
    processedAt: "Il y a 18 min",
  },
  {
    id: 4,
    fileName: "bon-commande-1048.png",
    type: "Image",
    size: "3,1 Mo",
    extractionMethod: "OCR",
    status: "En attente",
    processedAt: "Il y a 22 min",
  },
  {
    id: 5,
    fileName: "archive-corrompue.pdf",
    type: "PDF",
    size: "11,2 Mo",
    extractionMethod: "Tika",
    status: "Échec",
    processedAt: "Il y a 36 min",
  },
] as const;

export const dashboardNotifications: readonly DashboardNotification[] = [
  {
    id: 1,
    title: "Traitement terminé",
    description:
      "Le document facture-fournisseur-juillet.pdf est disponible.",
    time: "Il y a 4 min",
    read: false,
    type: "success",
  },
  {
    id: 2,
    title: "Traitement échoué",
    description:
      "Le document archive-corrompue.pdf nécessite une vérification.",
    time: "Il y a 36 min",
    read: false,
    type: "warning",
  },
  {
    id: 3,
    title: "Batch terminé",
    description:
      "Le batch de 18 documents a été traité avec 17 succès.",
    time: "Il y a 2 h",
    read: true,
    type: "info",
  },
] as const;