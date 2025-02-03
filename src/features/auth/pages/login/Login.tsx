import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useForgotPassword } from "../../hooks/useForgotPassword";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isLoading, error: loginError } = useLogin();
  const forgotPasswordMutation = useForgotPassword();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutate({ email, password });
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    forgotPasswordMutation.mutate(email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="max-w-[300px] w-full bg-white space-y-8 p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">
          Sign in to your account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-2xl font-medium text-red-500 "
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <button
          onClick={handleForgotPassword}
          className="w-full text-sm text-blue-600 hover:text-blue-500"
        >
          Forgot your password?
        </button>
      </div>
    </div>
  );
};

export default Login;
