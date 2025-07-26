// src/pages/signup.js
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AuthForm isLogin={false} />
    </div>
  );
}
