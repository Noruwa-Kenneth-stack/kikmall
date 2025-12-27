"use client";

import Footerheader from "@/components/Footer-header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-50">
        <Footerheader />
      </header>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 md:p-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#002551] text-center mb-4">
            Privacy Policy
          </h1>
          {/* <p className="text-center text-gray-600 mb-12">Last updated: November 19, 2025</p> */}

          <div className="prose prose-lg max-w-none text-gray-700 space-y-10 leading-relaxed">
            <p>
              At <strong>Kik</strong>, we respect your privacy and are committed
              to protecting your personal information. This Privacy Policy
              explains how we collect, use, share, and safeguard your data when
              you use the Kik mobile app and website.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-[#002551] mb-4">
                1. Information We Collect
              </h2>
              <ul className="list-disc pl-8 space-y-3">
                <li>
                  <strong>Information you give us:</strong> Name, email, phone
                  number, profile photo (optional), and any messages you send
                  us.
                </li>
                <li>
                  <strong>Location data:</strong> Approximate or precise
                  location (if you allow it) to show nearby deals and stores.
                </li>
                <li>
                  <strong>Usage data:</strong> Which deals you view, save, or
                  share; search history; favorite stores; app interactions.
                </li>
                <li>
                  <strong>Device & technical data:</strong> Device type, OS
                  version, unique device ID, IP address, crash reports.
                </li>
                <li>
                  <strong>Push notification tokens</strong> so we can send you
                  timely deals and reminders.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#002551] mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-8 space-y-2">
                <li>
                  Show you personalized, location-relevant deals and flyers
                </li>
                <li>
                  Notify you about expiring offers or new promotions in your
                  area
                </li>
                <li>Improve the app and fix bugs</li>
                <li>Send you marketing messages (you can opt out anytime)</li>
                <li>Prevent fraud and abuse</li>
                <li>
                  Comply with Nigerian law (NDPR 2019) and international
                  regulations
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#002551] mb-4">
                3. Sharing Your Information
              </h2>
              <p>We share your data only in these limited cases:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>
                  With retailers/brands whose deals you interact with (e.g.,
                  when you save or share a flyer)
                </li>
                <li>
                  With trusted service providers (cloud hosting, analytics, push
                  notifications) who are contractually bound to protect your
                  data
                </li>
                <li>
                  When required by law or to protect our rights and safety
                </li>
                <li>
                  In the event of a merger, acquisition, or sale of assets
                </li>
              </ul>
              <p className="mt-4 font-medium">
                We never sell your personal data to third parties for marketing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#002551] mb-4">
                4. Your Rights & Choices (NDPR Compliant)
              </h2>
              <ul className="list-disc pl-8 space-y-2">
                <li>Access, correct, or delete your personal data</li>
                <li>Withdraw consent for location or notifications</li>
                <li>Request a copy of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Delete your account completely</li>
              </ul>
              <p className="mt-4">
                To exercise any right, email us at{" "}
                <a
                  href="mailto:privacy@kik.africa"
                  className="text-[#002551] underline font-medium"
                >
                  privacy@kik.africa
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#002551] mb-4">
                5. Data Security
              </h2>
              <p>
                We use industry-standard encryption, secure servers in Nigeria
                and Europe, and regular security audits to protect your
                information. However, no method of transmission over the
                internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#002551] mb-4">
                6. Children
              </h2>
              <p>
                Kik is not intended for children under 13. We do not knowingly
                collect personal information from children under 13. If we learn
                we have, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#002551] mb-4">
                7. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by push notification or in-app
                notice. Continued use after changes means you accept the new
                policy.
              </p>
            </section>

            <section className="border-t pt-10 mt-16 text-center text-gray-600">
              <p>
                Thank you for trusting Kik with your data. We’re building a
                better, more private shopping experience — together.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
