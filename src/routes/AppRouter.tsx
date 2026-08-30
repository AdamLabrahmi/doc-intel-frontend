import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import DocumentDetails from "@/pages/DocumentDetails";
import DocumentQuestions from "@/pages/DocumentQuestions";
import Documents from "@/pages/Documents";
import DocumentUpload from "@/pages/DocumentUpload";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Conversations from "@/pages/Conversations";
import ConversationDetail from "@/pages/ConversationDetail";
import Users from "@/pages/Users";

import {
  ProtectedRoute,
} from "@/routes/ProtectedRoute";

import {
  AdminRoute,
} from "@/routes/AdminRoute";

import {
  ROUTES,
} from "@/routes/routePaths";

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
        element={
          <TemporaryPage title="Mot de passe oublié" />
        }
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
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.documentUpload}
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
        path={ROUTES.conversations}
        element={
          <ProtectedRoute>
            <Conversations />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.conversationDetail}
        element={
          <ProtectedRoute>
            <ConversationDetail />
          </ProtectedRoute>
        }
      />

      {/* Route ADMIN uniquement */}
      <Route
        path={ROUTES.users}
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />

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