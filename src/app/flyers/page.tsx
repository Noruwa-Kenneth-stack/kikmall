import { Suspense } from "react";
import FlyersPage from "./FlyersClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FlyersPage />
    </Suspense>
  );
}
