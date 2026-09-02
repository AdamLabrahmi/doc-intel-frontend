export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",

  dashboard: "/dashboard",
  profile: "/profile",

  documents: "/documents",
  documentUpload: "/documents/upload",

  documentDetails: (documentId: number | string) =>
    `/documents/${documentId}`,

  documentQuestions: (documentId: number | string) =>
    `/documents/${documentId}/questions`,

  conversations: "/conversations",

  conversationDetail: "/conversations/:conversationId",

  users: "/users",

  extractionBenchmark: "/extraction-benchmark",

  activity: "/dashboard/activity",
  settings: "/dashboard/settings",
} as const;