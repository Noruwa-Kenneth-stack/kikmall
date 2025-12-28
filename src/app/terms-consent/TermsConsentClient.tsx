"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TermsConsent() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleAccept = async () => {
    if (!checked || !email) return;

    const res = await fetch("/api/auth/accept-terms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      router.push("/flyers");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Accept Terms</h1>
      <p className="mb-4">
        You must accept our Terms of Use and Privacy Policy to continue.
      </p>
      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <span>
          I accept the{" "}
          <a
            href="/terms-of-service"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Privacy Policy
          </a>{" "}
          to continue.
        </span>
      </label>
      <button
        disabled={!checked}
        onClick={handleAccept}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Continue
      </button>
    </div>
  );
}
