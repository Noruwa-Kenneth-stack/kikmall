// src/app/blog/page.tsx
"use client";

import React from "react";
import Footerheader from "@/components/Footer-header";
import Footer from "@/components/Footer";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-300">
                <Footerheader />
              </header>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">KikHub: Your Ultimate Hub for Weekly Deals & Store Ads</h1>

        <p className="text-gray-700 mb-4">
          Welcome to <strong>KikHub</strong>, the one-stop destination for discovering weekly ads, store promotions, and exclusive deals in your city. Whether you’re looking for groceries, electronics, or the latest fashion, KikHub helps you stay updated on all the hottest offers without the hassle of visiting multiple stores.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Why KikHub?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>All-in-One Platform</strong> – Find weekly ads from multiple stores in one place.</li>
          <li><strong>Location-Based Listings</strong> – See offers tailored to your city or nearby locations.</li>
          <li><strong>Favorites & Alerts</strong> – Save your favorite stores and never miss a deal.</li>
          <li><strong>User-Friendly Experience</strong> – Simple, intuitive, and mobile-friendly interface.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">How It Works</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Select your city to see local store promotions.</li>
          <li>Browse categories like Featured, Latest, or A-Z listings.</li>
          <li>Explore weekly deals with interactive ads and store information.</li>
          <li>Add stores to your favorites for quick access to ongoing offers.</li>
        </ol>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Get Started Today</h2>
        <p className="text-gray-700">
          Whether you’re hunting for the best deals or planning your shopping for the week, <strong>KikHub</strong> makes it easier, faster, and fun. Don’t miss out — discover weekly ads near you and make your shopping smarter!
        </p>
      </div>
        {/* === Footer === */}
      <Footer />
    </div>
  );
};

export default BlogPage;
