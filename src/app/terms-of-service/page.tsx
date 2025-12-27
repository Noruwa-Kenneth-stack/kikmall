"use client";

import Footerheader from "@/components/Footer-header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-50">
        <Footerheader />
      </header>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 md:p-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#002551] text-center mb-4">
            Terms of Service
          </h1>
          

          <div className="prose prose-lg max-w-none text-gray-700 space-y-10 leading-relaxed">
            <p className="font-semibold text-lg">
              IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT DOWNLOAD, INSTALL,
              ACCESS, OR USE THE KIK MOBILE APPLICATION.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. DEFINITIONS</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>1.1 Application Provider:</strong> KIKmall, Lagos,
                  Nigeria.
                </li>
                <li>
                  <strong>1.2 Licensed Application:</strong> KIKmall app,
                  website, services, and updates.
                </li>
                <li>
                  <strong>1.3 Application Content:</strong> Text, graphics,
                  images, videos, logos, and third-party content.
                </li>
                <li>
                  <strong>1.4 Feedback:</strong> Suggestions, comments, or ideas
                  you submit.
                </li>
                <li>
                  <strong>1.5 Update:</strong> New versions, improvements, or
                  enhancements.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                2. SCOPE OF LICENSE AND RESTRICTIONS
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>2.1 Grant of License:</strong> Limited, non-exclusive,
                  revocable, personal use license.
                </li>
                <li>
                  <strong>2.2 Prohibited Uses:</strong> Do not:
                  <ul className="list-decimal list-inside ml-5 space-y-1">
                    <li>Use on devices you don’t own.</li>
                    <li>Copy, modify, or create derivative works.</li>
                    <li>Sell, rent, sublicense, or distribute.</li>
                    <li>Reverse engineer or tamper.</li>
                    <li>Use unlawfully or commercially without permission.</li>
                  </ul>
                </li>
                <li>
                  <strong>2.3 Updates:</strong> Governed by this Agreement
                  unless separate license applies.
                </li>
                <li>
                  <strong>2.4 Unauthorized Use:</strong> May result in
                  termination or legal action.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. FEEDBACK</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>3.1 Optional.</li>
                <li>
                  3.2 By giving Feedback, you transfer all rights to KIKmall.
                </li>
                <li>
                  3.3 Feedback must not infringe third-party rights or be
                  harmful.
                </li>
                <li>
                  3.4 KIKmall has no obligation to use or respond to Feedback.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                4. APPLICATION CONTENT
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  4.1 App contains proprietary and third-party content
                  (“Application Content”), provided “as-is.”
                </li>
                <li>4.2 Do not infringe rights of KIKmall or others.</li>
                <li>
                  4.3 Third-party content providers may enforce these terms.
                </li>
                <li>4.4 Section survives termination.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                5. DATA COLLECTION AND USE
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>5.1 Data collected: usage info, device info, location.</li>
                <li>5.2 Governed by KIKmall <a href="/privacy" className="text-[#002551] underline font-medium">Privacy Policy</a>.</li>
                <li>5.3 Survives termination.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                6. TERMINATION AND MODIFICATION
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  6.1 License effective until terminated. Non-compliance may end
                  access.
                </li>
                <li>6.2 KIKmall may modify, suspend, or discontinue app.</li>
                <li>6.3 Certain provisions survive termination.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                7. WARRANTIES, LIABILITY, INDEMNIFICATION
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>7.1 No Warranties – App is “as-is.”</li>
                <li>
                  7.2 Limitation of Liability – Not responsible for damages or
                  losses.
                </li>
                <li>
                  7.3 Indemnification – You defend and indemnify KIKmall from
                  claims arising from your use.
                </li>
                <li>7.4 Survives termination.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. LEGAL COMPLIANCE</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  8.1 Use according to Nigerian law; do not use illegally.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. GOVERNING LAW</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>9.1 Governed by laws of Nigeria.</li>
                <li>9.2 Disputes resolved in Lagos State courts.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. GENERAL</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>10.1 Entire Agreement governs use.</li>
                <li>10.2 Headings for reference only.</li>
                <li>10.3 Cannot assign without permission.</li>
                <li>10.4 Some provisions survive termination.</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
