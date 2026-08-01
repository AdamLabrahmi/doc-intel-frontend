import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export default function Register() {
  return (
    <AuthLayout
      title="Créer votre compte"
      description="Créez votre espace pour centraliser, traiter et consulter vos documents."
    >
      <RegisterForm />
    </AuthLayout>
  );
}