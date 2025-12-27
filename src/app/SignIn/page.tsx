"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignupHeader from "@/components/SignupHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!acceptTerms) {
      setErrorMsg("You must accept the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ ensure cookie handling
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        await login(); // refresh auth context
        router.push("/flyers");
      } else {
        setErrorMsg(data.message || "Login failed! Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <SignupHeader />
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-snug"
                >
                  I accept the{" "}
                  <a href="/terms-of-service" className="text-blue-600 hover:underline">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!acceptTerms || loading}
                  className="cursor-pointer w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator className="bg-gray-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-3 text-gray-500 text-sm z-10">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full cursor-pointer flex items-center justify-center"
                onClick={async () => {
                  if (!acceptTerms) {
                    setErrorMsg(
                      "You must accept the Terms of Use and Privacy Policy."
                    );
                    return;
                  }

                  const popup = window.open(
                    "/api/auth/google",
                    "googleLogin",
                    "width=500,height=600"
                  );

                  // Listen for message from popup
                  window.addEventListener("message", async (event) => {
                    if (event.origin !== window.location.origin) return;

                    if (event.data.type === "social-login-success") {
                      popup?.close();
                      await login(); // ✅ Fetch latest user with name & picture
                      router.push("/flyers");
                    }
                  });
                }}
              >
                <Image
                  src="/08/google.png"
                  alt="Google logo"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                Google
              </Button>

              <Button
                variant="outline"
                className="w-full cursor-pointer bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                onClick={async () => {
                  if (!acceptTerms) {
                    setErrorMsg(
                      "You must accept the Terms of Use and Privacy Policy."
                    );
                    return;
                  }
                  const popup = window.open(
                    "/api/auth/facebook",
                    "facebookLogin",
                    "width=500,height=600"
                  );

                  // Listen for message from popup
                  window.addEventListener("message", async (event) => {
                    if (event.origin !== window.location.origin) return;

                    if (event.data.type === "social-login-success") {
                      popup?.close();
                      await login(); // ✅ Fetch latest user with name & picture
                      router.push("/flyers");
                    }
                  });
                }}
              >
                <Image
                  src="/08/fb.png"
                  alt="Facebook logo"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                Facebook
              </Button>
            </div>

            {/* Switch to Sign Up */}
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                onClick={() => router.push("/SignUp")}
              >
                Sign up
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignIn;
