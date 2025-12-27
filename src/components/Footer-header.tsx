"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Footerheader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className=" sticky  top-0 left-0 w-full z-20 bg-black/30 backdrop-blur-sm hover:bg-blue-900/40 transition duration-600">
      {/* === Header Row === */}
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Kik
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
          <Link href="/" className="hover:text-yellow-300">
            Home
          </Link>
          <Link href="/faq" className="hover:text-yellow-300">
            FAQ
          </Link>
          <Link href="/contact-us" className="hover:text-yellow-300">
            Contact Us
          </Link>
          <Link href="/help" className="hover:text-yellow-300">
            Support
          </Link>
        </nav>

        {/* Partner Button (desktop only) */}
        <Link
          href="/contact-us#send-message"
          scroll={false}
          className="hidden sm:inline-block bg-white text-blue-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-100"
        >
          Let’s Partner →
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:text-yellow-300"
          >
            {isMobileMenuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* === MOBILE MENU DROPDOWN (SEPARATED) === */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 
          ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="bg-black/40 backdrop-blur-md border-t border-white/20">
          <nav className="px-6 py-4 space-y-3">
            <Link
              href="/flyers"
              className="block text-white/90 hover:text-yellow-300"
            >
              Home
            </Link>

            <Link
              href="/shopping-list"
              className="block text-white/90 hover:text-yellow-300"
            >
              Faqs
            </Link>

            <Link
              href="/about"
              className="block text-white/90 hover:text-yellow-300"
            >
              Contact us
            </Link>

            <Link
              href="/blog"
              className="block text-white/90 hover:text-yellow-300"
            >
              Support
            </Link>
          </nav>
          <Link
            href="/contact-us#send-message"
            className="hidden sm:inline-block bg-white text-blue-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-100"
          >
            Let’s Partner →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footerheader;
