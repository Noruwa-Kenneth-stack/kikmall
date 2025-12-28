import { Suspense } from "react";
import TermsConsentClient from "./TermsConsentClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TermsConsentClient />
    </Suspense>
  );
}
