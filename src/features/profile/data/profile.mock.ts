export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  initials: string;
  createdAt: string;
  lastLoginAt: string;
  documentsCount: number;
  completedDocumentsCount: number;
}

export const currentUserProfile: UserProfile = {
  id: 1,
  fullName: "Adam Labrahmi",
  email: "adam@example.com",
  role: "Administrateur",
  initials: "AL",
  createdAt: "15 juillet 2026",
  lastLoginAt: "Aujourd’hui à 10:42",
  documentsCount: 248,
  completedDocumentsCount: 231,
};