"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";

const LoginForm = () => {
  const { signInWithEmail, signInWithGoogle, resetPassword, loading } = useAuthContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordless, setShowPasswordless] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsEmail, setNeedsEmail] = useState(false);

  const router = useRouter();

  // 🔹 Detect email link on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isSignInWithEmailLink(auth, window.location.href)) {
      setIsLoading(true);
      setMessage("Verifying your email link...");

      const storedEmail = localStorage.getItem("emailForSignIn");
      if (!storedEmail) {
        setNeedsEmail(true);
        setIsLoading(false);
        return;
      }

      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then(() => {
          localStorage.removeItem("emailForSignIn");
          setMessage("✅ Successfully signed in!");
          router.push("/"); // Redirect to home after success
        })
        .catch((err) => {
          setError(`Error signing in: ${err.message}`);
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError("Please fill in all fields");

    try {
      setIsLoading(true);
      await signInWithEmail(formData.email, formData.password);
      setMessage("Login successful!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      setMessage("Google login successful!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Passwordless login: send link
  const handlePasswordlessLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return setError("Please enter your email address");

    try {
      setIsLoading(true);
      const actionCodeSettings = {
        url: window.location.origin + "/auth/login", // SAME login page
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, formData.email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", formData.email);
      setMessage("✅ Email link sent! Check your inbox and click the link.");
    } catch (err: any) {
      setError(err.message || "Failed to send email link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return setError("Please enter your email to complete sign-in");

    try {
      setIsLoading(true);
      await signInWithEmailLink(auth, formData.email, window.location.href);
      localStorage.removeItem("emailForSignIn");
      setMessage("✅ Successfully signed in!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Error completing sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  const currentLoading = loading || isLoading;

  return (
    <div className="flex h-[91vh] w-full">
      {/* Left image */}
      <div className="w-full hidden md:inline-block h-[90vh]">
        <img
          className="h-full pl-40"
          src="https://i.pinimg.com/736x/fa/26/e0/fa26e0638127021a3b41efbbaab82332.jpg"
          alt="leftSideImage"
        />
      </div>

      {/* Right form */}
      <div className="w-full flex flex-col items-center justify-center p-8 bg-white">
        <form className="md:w-96 w-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-gray-900 font-medium mb-2">Sign in</h2>
          <p className="text-sm text-gray-500/90 mb-6">Welcome back! Please sign in to continue</p>

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm w-full">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm w-full">
              {error}
            </div>
          )}

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={currentLoading}
            className="w-full mt-4 bg-gray-500/10 hover:bg-gray-500/20 flex items-center justify-center h-12 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full my-6">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="text-nowrap text-sm text-gray-500/90">or sign in with email</p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {/* Toggle */}
          <div className="flex w-full bg-gray-100 rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => setShowPasswordless(false)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                !showPasswordless ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordless(true)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                showPasswordless ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Passwordless
            </button>
          </div>

          {/* Email input */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-4 focus-within:border-blue-500 transition-colors">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-6"
              required
            />
          </div>

          {!showPasswordless ? (
            <>
              {/* Password input */}
              <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-3 mb-6 focus-within:border-blue-500 transition-colors">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-6 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember & forgot */}
              <div className="w-full flex items-center justify-between mb-6 text-gray-500/80">
                <div className="flex items-center gap-2">
                  <input
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="text-sm">Remember me</label>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgetpass")}
                  className="text-sm text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                onClick={handleEmailPasswordLogin}
                disabled={currentLoading}
                className="w-full h-12 rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {currentLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Sign In"}
              </button>
            </>
          ) : needsEmail ? (
            // Complete sign-in if email not in localStorage
            <button
              type="submit"
              onClick={handleCompleteSignIn}
              disabled={currentLoading}
              className="w-full h-12 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {currentLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Complete Sign-In"}
            </button>
          ) : (
            <button
              type="submit"
              onClick={handlePasswordlessLogin}
              disabled={currentLoading}
              className="w-full h-12 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {currentLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Login Link to Email"}
            </button>
          )}

          <p className="text-gray-500/90 text-sm mt-6 text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
