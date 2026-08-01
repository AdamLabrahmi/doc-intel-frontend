export interface PublicNavigationItem {
  label: string;
  href: string;
}

export const publicNavigationItems: readonly PublicNavigationItem[] = [
  {
    label: "Fonctionnalités",
    href: "#features",
  },
  {
    label: "Fonctionnement",
    href: "#process",
  },
  {
    label: "Technologies",
    href: "#technologies",
  },
] as const;