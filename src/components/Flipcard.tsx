"use client";

import { useState } from "react";
import Image from "next/image";

export default function FlipImageCard() {
  const [flipped, setFlipped] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleFlip = () => {
    setFlipped(true);

    // Start shake 2.5s in, then flip back at 3s
    setTimeout(() => setShaking(true), 2500);
    setTimeout(() => {
      setShaking(false);
      setFlipped(false);
    }, 3000);
  };

  return (
    <div className="order-1 lg:order-2">
      <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
        {/* Flip container */}
        <div
          className="group [perspective:1000px] cursor-pointer"
          onClick={handleFlip} // mobile tap triggers flip + auto flip back
        >
          <div
            className={`relative aspect-[4/3] lg:aspect-[5/4] w-full rounded-2xl shadow-lg transition-transform duration-700 [transform-style:preserve-3d]
              ${flipped ? "[transform:rotateY(180deg)]" : "group-hover:[transform:rotateY(180deg)]"}
              ${shaking ? "animate-shake" : ""}
            `}
          >
            {/* Front Side */}
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <Image
                src="/assets/browseflyerdeals-2.jpg"
                alt="Deals Section Front"
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <Image
                src="/assets/browseflyerdeals-3.png"
                alt="Deals Section Back"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Optional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl pointer-events-none" />
      </div>
    </div>
  );
}
