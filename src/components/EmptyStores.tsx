"use client";

import Lottie from "lottie-react";
import shrugCharacter from "@/lotties/shrug-character.json";

interface EmptyStoresProps {
  city: string;
}

const EmptyStores = ({ city }: EmptyStoresProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
      <div className="w-64 mb-6">
        <Lottie animationData={shrugCharacter} loop />
      </div>

      <h3 className="text-xl font-semibold mb-2">
        No stores available for this location
      </h3>

      <p className="max-w-md text-sm">
        We don’t have weekly ads for <strong>{city}</strong> yet.  
        Try searching a nearby location like <strong>Ikeja</strong>,{" "}
        <strong>Yaba</strong>, or <strong>Lekki</strong>.
      </p>
    </div>
  );
};

export default EmptyStores;
