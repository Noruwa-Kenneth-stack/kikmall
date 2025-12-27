"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  "/patterns/supermarket-icon-png-12852.png",
  "/patterns/smiling-young-gardener-afro-american-guy-wearing-gardening-hat-holding-vegetable-basket-with-pumpkin-isolated-blue-wall-Photoroom.png",
  "/patterns/image-from-rawpixel-id-6121805-png.png",
  "/patterns/groceries 1-Photoroom.png",
  "/patterns/front-view-woman-wearing-hat-Photoroom.png",
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-96 lg:h-96 aspect-square overflow-hidden flex-shrink">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 200, opacity: 0 }} // new image starts from the right
          animate={{ x: 0, opacity: 1 }} // moves into place
          exit={{ y: -100, opacity: 0 }} // old image goes upward
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src={images[index]}
            alt="Sliding image"
            width={400}
            height={400}
            className="object-contain rounded-lg"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
