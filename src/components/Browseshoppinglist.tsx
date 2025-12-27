"use client";

import Image from "next/image";
import Link from "next/link";

const DealsSection = () => {
  return (
    <section className="py-4 bg-white mt-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center text-center md:text-left">
        {/* Screenshot Image */}
        <div>
          <Image
            src="/assets/browseflyerdeals-4.gif"
            alt="Flyers screenshot"
            width={800}
            height={600}
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay organized with your{" "}
            <span className="text-blue-600">digital Shopping List.</span>
          </h2>
          <p className="text-gray-700 mb-4">
            Build Your List, Unlock the Best Deals Shopping has never been
            easier. With KIK, you can add items from weekly deals or create your
            own shopping list from scratch. Our smart system instantly finds the
            best discounts at nearby stores—saving you both time and money.The KIK App keeps your
            list organized and always within reach. Download today and start
            shopping smarter, not harder.
          </p>

          {/* Store Logos with Circle + Shadow */}
          <div className="grid grid-cols-4 gap-4 place-items-center mb-6">
            {[
              "myYogurt.svg",
              "myMilk.svg",
              "myCheese.svg",
              "myButter.svg",
              "myBread.svg",
              "myApple.svg",
              "myBroccoli.svg",
              "myApple.svg",
            ].map((logo, idx) => (
              <div
                key={idx}
                className="rounded-full shadow-md bg-white p-3 flex items-center justify-center w-16 h-16"
              >
                <Image
                  src={`/svg/${logo}`}
                  alt={logo.replace(".svg", "")}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          <Link
            href="/shoppinglist"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <div className="flex justify-center items-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
                Create a Shopping List
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
