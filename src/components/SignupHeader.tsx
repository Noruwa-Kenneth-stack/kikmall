"use client";

import React from "react";
import Link from "next/link";

const SignupHeader = () => {
  return (
    <div className="sticky top-0 z-40 bg-cyan-500 border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Link href="/" className="flex items-center ">
         <div className="text-5xl font-bold text-white italic mb-4 items-center">
              kik
            </div>
        </Link>
      </div>
    </div>
  );
};

export default SignupHeader;