"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Footerheader from "@/components/Footer-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
       <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-50">
        <Footerheader />
      </header>
      
      {/* Hero Section */}
      <section className="relative h-[100vh] flex flex-col justify-center text-white">
        {/* Background image */}
        <Image
          src="/08/street-market-night.jpg" // replace with your uploaded image path
          alt="Shopping background"
          fill
          priority
          className="object-cover object-center brightness-[0.55]"
        />

        {/* Overlay content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10">
          <p className="text-sm sm:text-base mb-3 font-medium text-gray-200">
            Our Mission
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Help Nigerians make smarter <br className="hidden sm:block" />
            shopping decisions
          </h1>

          <Link
            href="/flyers"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            Learn More <span className="text-lg">→</span>
          </Link>
        </div>

      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-xl sm:text-2xl text-blue-600 font-semibold mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-2 text-2xl sm:text-3xl">
            We help shoppers save money by giving them tools to choose what and
            where to buy.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            We’re building the fastest way to discover weekly deals, compare
            prices, and shop smarter across your favorite Nigerian stores.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Kik was created to help shoppers save time and money by putting all
            flyers, promotions, and price comparisons in one simple, intuitive
            app. Whether you’re looking for groceries in Lagos or electronics in
            Ikeja, Kik makes it easy to find what’s on sale near you.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe in transparency, accessibility, and empowering local
            businesses to reach more customers digitally.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/08/girl-7024553_1280.jpg"
            alt="Shopping illustration"
            width={600}
            height={600}
            className="rounded-lg drop-shadow-lg"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10">Our Values</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                Transparency
              </h3>
              <p className="text-gray-600">
                We list real deals from real stores—no hidden prices, no fake
                discounts.
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                Simplicity
              </h3>
              <p className="text-gray-600">
                We design Kik to be light, fast, and easy to navigate—so you can
                find what you need instantly.
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                Local Empowerment
              </h3>
              <p className="text-gray-600">
                By connecting buyers with neighborhood stores, we help local
                businesses grow in the digital economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Join the Kik Community
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Discover the best deals in your city, compare prices, and shop smarter
          every week with Kik.
        </p>
        <Link
          href="/flyers"
          className="inline-block bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition"
        >
          Explore Weekly Ads
        </Link>
      </section>

      {/* Footer Note */}
      <Footer />
    </div>
  );
}
