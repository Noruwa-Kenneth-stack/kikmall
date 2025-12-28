import { Suspense } from "react";
import ShoppingClient from "./ShoppingClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ShoppingClient />
    </Suspense>
  );
}
