// app/privacy.tsx
export const metadata = {
  title: "Privacy Policy",
  description: "KIKMall Privacy Policy",
};

export default function Privacy() {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Privacy Policy</h1>
      <p>
        Welcome to KIKMall. We respect your privacy and are committed to protecting your personal information.
      </p>

      <h2>Information Collection</h2>
      <p>
        We collect information necessary to provide our services, including your name, email, and account data.
      </p>

      <h2>Data Usage</h2>
      <p>
        Your data is used only to provide and improve our services. We never share your personal information with third parties without consent.
      </p>

      <h2>Data Deletion</h2>
      <p>
        If you wish to delete your account or personal data, contact us at{" "}
        <a href="mailto:support@kikmall.com">support@kikmall.com</a>. We will process deletion requests promptly.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about this Privacy Policy, email <a href="mailto:support@kikmall.com">support@kikmall.com</a>.
      </p>
    </main>
  );
}
