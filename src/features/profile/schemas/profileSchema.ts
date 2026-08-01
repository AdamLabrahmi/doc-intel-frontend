import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Le nom complet est obligatoire.")
    .min(3, "Le nom complet doit contenir au moins 3 caractères.")
    .max(100, "Le nom complet ne peut pas dépasser 100 caractères."),

  email: z
    .string()
    .trim()
    .min(1, "L’adresse e-mail est obligatoire.")
    .email("Veuillez saisir une adresse e-mail valide."),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;