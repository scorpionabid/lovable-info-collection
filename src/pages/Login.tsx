
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-infoline-light-blue/10 to-white p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-scale-in">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
