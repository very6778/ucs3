"use client"

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const rawCdnBase = process.env.NEXT_PUBLIC_CDN_URL || "";
const cdnBase = rawCdnBase.endsWith("/") ? rawCdnBase.slice(0, -1) : rawCdnBase;
const initialLogoSrc = cdnBase ? `${cdnBase}/logo.webp` : "/logo.webp";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [logoSrc, setLogoSrc] = useState(initialLogoSrc);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowAlert(false);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setShowAlert(true);
        setIsLoading(false);
        return;
      }

      router.push("/admin");
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setShowAlert(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showAlert]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleImageError = () => {
    if (logoSrc !== "/logo.webp") {
      setLogoSrc("/logo.webp");
    }
  };

  return (
    <div className="relative flex min-h-screen bg-white">
      {/* Error */}
      {showAlert && (
        <div className="pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[80vw] max-w-md px-4 transition-opacity duration-500 animate-fadeInOut">
          <Alert
            variant="destructive"
            className="flex items-center justify-center gap-3 shadow-lg bg-red-50 border border-red-200"
          >
            <AlertDescription className="text-sm font-medium text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Logo */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <img
          src={logoSrc}
          alt="Logo"
          className="h-24 w-auto object-contain"
          onError={handleImageError}
        />
      </div>

      {/* Divider */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="h-[60vh] w-px bg-gray-300" />
      </div>

      {/* Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 md:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-sm text-gray-500">Sign in to access admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-11 font-medium transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}