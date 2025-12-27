"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import SignupHeader from "@/components/SignupHeader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 7) {
      setErrorMsg("Password must be at least 7 characters long!");
      return;
    }

    if (!acceptTerms) {
      setErrorMsg("You must accept the Terms of Use and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          termsAccepted: acceptTerms, // ✅ send checkbox value
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Verification email sent! Please check your inbox.");
        router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
      } else {
        setErrorMsg(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMsg("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignupHeader />
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
          </CardHeader>

          {/* Switch to Sign Up */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
              onClick={() => router.push("/SignIn")}
            >
              Sign in
            </button>
          </p>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

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

              {errorMsg && (
                <p className="text-red-600 text-sm text-center">{errorMsg}</p>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!acceptTerms || loading}
                  className="w-3/4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>

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
                  onClick={() => {
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
                    window.addEventListener("message", (event) => {
                      if (event.origin !== window.location.origin) return; // 🔒 security check

                      if (event.data.type === "social-login-success") {
                        router.push("/flyers");
                        popup?.close();
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
                  onClick={() => {
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
                    window.addEventListener("message", (event) => {
                      if (event.origin !== window.location.origin) return; // security check
                      if (event.data.type === "social-login-success") {
                        // ✅ Social login succeeded → reload auth state
                        router.push("/flyers");
                        popup?.close();
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
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignUp;
