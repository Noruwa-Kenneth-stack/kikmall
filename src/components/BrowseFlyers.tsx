"use client";

import Image from "next/image";
import Link from "next/link";
import Flipcard from "./Flipcard";

const DealsSection = () => {
  return (
    <section className="py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center  text-center md:text-left">
        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Unlock savings at{" "}
            <span className="text-blue-600">2,000+ top stores</span> near you.
          </h2>
          <p className="text-gray-700 mb-4">
            Discover fresh deals, weekly flyers, and the best discounts—all in
            one place. KIK makes saving money simple, fast, and fun.
          </p>
          <p className="text-gray-700 mb-6">
            Want the best experience? Get the{" "}
            <span className="font-semibold">KIK app </span>
            and shop smarter anytime, anywhere. Available now on Google Play.
          </p>

          {/* Store Logos */}
          <div className="grid grid-cols-4 gap-2 place-items-center mb-6">
            {[
              "techstore.png",
              "sport.png",
              "perf.png",
              "home.png",
              "health.png",
              "boutique.png",
              "bottle and glasses.png",
              "justrite.png",
            ].map((logo, idx) => (
              <Image
                key={idx}
                src={`/logo/${logo}`}
                alt={logo.replace(".png", "")}
                width={100}
                height={40}
                className="object-contain h-20"
              />
            ))}
          </div>

          <div className="flex justify-center items-center">
            <Link href="/flyers">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
                Browse Flyers
              </button>
            </Link>
          </div>
        </div>

        {/* right side Image */}
        <Flipcard />
      </div>
    </section>
  );
};

export default DealsSection;
