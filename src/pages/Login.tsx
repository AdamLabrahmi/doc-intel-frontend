import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export default function Login() {
  return (
    <AuthLayout
      title="Bienvenue"
      description="Connectez-vous pour accéder à votre espace documentaire."
    >
      <LoginForm />
    </AuthLayout>
  );
}