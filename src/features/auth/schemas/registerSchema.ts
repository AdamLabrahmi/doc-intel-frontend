import { z } from "zod";

export const registerSchema = z
  .object({
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

    password: z
      .string()
      .min(1, "Le mot de passe est obligatoire.")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule.",
      )
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule.",
      )
      .regex(
        /\d/,
        "Le mot de passe doit contenir au moins un chiffre.",
      ),

    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est obligatoire."),

    acceptTerms: z
      .boolean()
      .refine(
        (value) => value,
        "Vous devez accepter les conditions d’utilisation.",
      ),
  })
  .refine(
    (values) => values.password === values.confirmPassword,
    {
      message: "Les mots de passe ne correspondent pas.",
      path: ["confirmPassword"],
    },
  );

export type RegisterFormValues = z.infer<typeof registerSchema>;