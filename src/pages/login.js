// src/pages/login.js
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AuthForm isLogin={true} />
    </div>
  );
}
