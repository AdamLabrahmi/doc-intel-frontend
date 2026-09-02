import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ConversationDetail from "@/pages/ConversationDetail";
import Conversations from "@/pages/Conversations";
import Dashboard from "@/pages/Dashboard";
import DocumentDetails from "@/pages/DocumentDetails";
import DocumentQuestions from "@/pages/DocumentQuestions";
import Documents from "@/pages/Documents";
import DocumentUpload from "@/pages/DocumentUpload";
import ExtractionBenchmarkPage from "@/pages/ExtractionBenchmarkPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Settings from "@/pages/Settings";
import Users from "@/pages/Users";

import {
  AdminRoute,
} from "@/routes/AdminRoute";

import {
  ProtectedRoute,
} from "@/routes/ProtectedRoute";

import {
  ROUTES,
} from "@/routes/routePaths";

function TemporaryPage({
  title,
}: {
  title: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 transition-colors dark:bg-slate-950">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-950/5 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
          Prochaine étape
        </p>

        <h1 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">
          {title}
        </h1>
      </div>
    </main>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* ============================= */}
      {/* Routes publiques             */}
      {/* ============================= */}

      <Route
        path={
          ROUTES.home
        }
        element={
          <Home />
        }
      />

      <Route
        path={
          ROUTES.login
        }
        element={
          <Login />
        }
      />

      <Route
        path={
          ROUTES.register
        }
        element={
          <Register />
        }
      />

      <Route
        path={
          ROUTES.forgotPassword
        }
        element={
          <TemporaryPage
            title="Mot de passe oublié"
          />
        }
      />

      {/* ============================= */}
      {/* Routes protégées             */}
      {/* ============================= */}

      <Route
        path={
          ROUTES.dashboard
        }
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.profile
        }
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.documents
        }
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.documentUpload
        }
        element={
          <ProtectedRoute>
            <DocumentUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents/:documentId"
        element={
          <ProtectedRoute>
            <DocumentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents/:documentId/questions"
        element={
          <ProtectedRoute>
            <DocumentQuestions />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.conversations
        }
        element={
          <ProtectedRoute>
            <Conversations />
          </ProtectedRoute>
        }
      />

      <Route
        path={
          ROUTES.conversationDetail
        }
        element={
          <ProtectedRoute>
            <ConversationDetail />
          </ProtectedRoute>
        }
      />

      {/* ============================= */}
      {/* Activité                     */}
      {/* ============================= */}

      <Route
        path={
          ROUTES.activity
        }
        element={
          <ProtectedRoute>
            <TemporaryPage
              title="Activité"
            />
          </ProtectedRoute>
        }
      />

      {/* ============================= */}
      {/* Paramètres                   */}
      {/* ============================= */}

      <Route
        path={
          ROUTES.settings
        }
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ============================= */}
      {/* Administration               */}
      {/* ============================= */}

      <Route
        path={
          ROUTES.users
        }
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />

      <Route
        path={
          ROUTES.extractionBenchmark
        }
        element={
          <AdminRoute>
            <ExtractionBenchmarkPage />
          </AdminRoute>
        }
      />

      {/* ============================= */}
      {/* Fallback                     */}
      {/* ============================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              ROUTES.home
            }
            replace
          />
        }
      />
    </Routes>
  );
}