import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Menu,
  X,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { publicNavigationItems } from "@/config/public-navigation.config";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={
        shouldReduceMotion
          ? false
          : {
              y: -80,
              opacity: 0,
            }
      }
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          onClick={closeMobileMenu}
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

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navigation principale"
        >
          {publicNavigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-2 text-sm font-medium text-slate-600 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-blue-600 after:transition-transform after:duration-300 hover:text-blue-700 hover:after:scale-x-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950",
            )}
          >
            Se connecter
          </Link>

          <Link
            to="/register"
            className={cn(
              buttonVariants(),
              "group rounded-xl bg-blue-600 px-5 shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25",
            )}
          >
            Créer un compte

            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen((currentValue) => !currentValue);
          }}
          className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 lg:hidden"
          aria-label={
            isMobileMenuOpen
              ? "Fermer le menu de navigation"
              : "Ouvrir le menu de navigation"
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="public-mobile-navigation"
        >
          {isMobileMenuOpen ? (
            <X
              className="size-5"
              aria-hidden="true"
            />
          ) : (
            <Menu
              className="size-5"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      <motion.div
        id="public-mobile-navigation"
        initial={false}
        animate={
          isMobileMenuOpen
            ? {
                height: "auto",
                opacity: 1,
              }
            : {
                height: 0,
                opacity: 0,
              }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="space-y-1 px-5 py-5 sm:px-8">
          <nav aria-label="Navigation principale mobile">
            {publicNavigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="grid gap-3 border-t border-slate-100 pt-4">
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "h-11 w-full rounded-xl border-slate-300 bg-white text-slate-700",
              )}
            >
              Se connecter
            </Link>

            <Link
              to="/register"
              onClick={closeMobileMenu}
              className={cn(
                buttonVariants(),
                "h-11 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700",
              )}
            >
              Créer un compte

              <ArrowRight
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}