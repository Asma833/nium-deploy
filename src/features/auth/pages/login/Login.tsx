import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { Eye, EyeOff,Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import logo from "../../../../assets/images/nium-logo.svg"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isLoading, error: loginError } = useLogin();
  const forgotPasswordMutation = useForgotPassword();
  const [showPassword, setShowPassword] = useState(false);

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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // return (
  //   <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
  //     <div className="max-w-[300px] w-full bg-white space-y-8 p-8 rounded-lg shadow">
  //       <h2 className="text-3xl font-bold text-center">
  //         Sign in to your account
  //       </h2>

  //       {error && (
  //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ">
  //           {error}
  //         </div>
  //       )}

  //       <form onSubmit={handleLogin} className="space-y-6">
  //         <div>
  //           <label
  //             htmlFor="email"
  //             className="block text-2xl font-medium text-red-500 "
  //           >
  //             Email address
  //           </label>
  //           <input
  //             id="email"
  //             type="email"
  //             required
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
  //           />
  //         </div>

  //         <div>
  //           <label
  //             htmlFor="password"
  //             className="block text-sm font-medium text-gray-700"
  //           >
  //             Password
  //           </label>
  //           <input
  //             id="password"
  //             type="password"
  //             required
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
  //           />
  //         </div>

  //         <button
  //           type="submit"
  //           disabled={isLoading}
  //           className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
  //             isLoading ? "opacity-50 cursor-not-allowed" : ""
  //           }`}
  //         >
  //           {isLoading ? "Signing in..." : "Sign in"}
  //         </button>
  //       </form>

  //       <button
  //         onClick={handleForgotPassword}
  //         className="w-full text-sm text-blue-600 hover:text-blue-500"
  //       >
  //         Forgot your password?
  //       </button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 bg-white p-8 rounded-lg">
       <img src={logo} className="m-auto h-12"/>
        <div>
          <h2 className="text-left text-1xl font-bold text-gray-900">
            Log in
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                   className="appearance-none rounded-md text-sm relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-gray-300 focus:border-2 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[0_0_0_30px_white_inset]"
                 
                  placeholder="jasan.gay@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  required
                  className="appearance-none rounded-md relative text-sm block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-gray-300 focus:border-2 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[0_0_0_30px_white_inset]"
                 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a onClick={handleForgotPassword}
              href="#"
              className="text-sm text-gray-500 hover:text-pink-500"
            >
              Forgot Password?
            </a>
          </div>

          <div>
            {
              !isLoading ? (
                <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600"
              >
                Log in
              </button>

              ):(
              <Button disabled className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
              )
            }
         
            
          </div>
        </form>
      </div>
    </div>
  );

};

export default Login;
