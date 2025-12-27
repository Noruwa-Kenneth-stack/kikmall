"use client";

import React, { useEffect } from "react";

export default function GoogleSuccess() {
  useEffect(() => {
    window.opener?.postMessage(
      { type: "social-login-success" },
      window.location.origin
    );
    window.close();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      Login successful — closing...
    </div>
  );
}
