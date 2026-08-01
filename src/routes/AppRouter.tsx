import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ROUTES } from "@/routes/routePaths";

function TemporaryPage({
  title,
}: {
  title: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-950/5">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
          Prochaine étape
        </p>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">
          {title}
        </h1>
      </div>
    </main>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route
        path={ROUTES.home}
        element={<Home />}
      />

      <Route
        path={ROUTES.login}
        element={<Login />}
      />

      <Route
        path={ROUTES.register}
        element={<Register />}
      />

      <Route
        path={ROUTES.forgotPassword}
        element={<TemporaryPage title="Mot de passe oublié" />}
      />

      {/* Routes protégées */}
      <Route
        path={ROUTES.dashboard}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.profile}
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.documents}
        element={
          <ProtectedRoute>
            <TemporaryPage title="Documents" />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.documentUpload}
        element={
          <ProtectedRoute>
            <TemporaryPage title="Importer des documents" />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.activity}
        element={
          <ProtectedRoute>
            <TemporaryPage title="Activité" />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.settings}
        element={
          <ProtectedRoute>
            <TemporaryPage title="Paramètres" />
          </ProtectedRoute>
        }
      />

      {/* Route inconnue */}
      <Route
        path="*"
        element={
          <Navigate
            to={ROUTES.home}
            replace
          />
        }
      />
    </Routes>
  );
}