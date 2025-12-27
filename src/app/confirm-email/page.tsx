"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
// import SignupHeader from "@/components/SignupHeader";

const ConfirmEmail = () => {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      // Check if response is OK before parsing JSON
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unexpected error occurred' }));
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await res.json();

      if (res.ok) {
        alert("✅ Email verified successfully! You can now log in.");
        router.push("/SignIn");
      } else {
        setErrorMsg(data.message || "Verification failed!");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      if (error instanceof Error) {
        setErrorMsg(error.message || "Failed to verify email. Please try again.");
      } else {
        setErrorMsg("Failed to verify email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setResendLoading(true);
    setErrorMsg(null);

    try {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode: newCode }),
      });

      setErrorMsg("Verification code resent successfully. Please check your email.");
    } catch (error) {
      console.error("Resend failed:", error);
      setErrorMsg("Failed to resend verification code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p>In order to verify your account, please enter your verification code below.</p>
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-gray-600">
              Didn&apos;t receive a verification code? Please check your spam or junk mail folder or{" "}
              <Button
                variant="link"
                onClick={handleResendCode}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend"}
              </Button>
            </div>
            {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 ease-in-out"
              >
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmail;