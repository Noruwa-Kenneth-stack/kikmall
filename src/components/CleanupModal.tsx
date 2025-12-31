"use client";

import React, { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface CleanupDropdownProps {
  onClear: () => void;
  disabled?: boolean;
  open: boolean;
  onClose: () => void;
}

const CleanupDropdown: React.FC<CleanupDropdownProps> = ({
  onClear,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click (desktop safety)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    onClear();
    setLoading(false);
    setIsOpen(false);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 1500);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-600 
          hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2 
          transition duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Trash2 className="h-4 w-4" />
        <span className="text-sm hidden sm:inline">Clean Up List</span>
      </button>

      {/* Modal / Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="
              fixed md:absolute
              inset-0 md:inset-auto
              md:top-full md:left-1/2 md:-translate-x-1/2
              flex items-center justify-center
              md:block
              bg-black/40 md:bg-transparent
              z-[1000]
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="
                bg-white rounded-lg p-6 w-[90%] max-w-sm
                md:w-72
                shadow-lg border border-gray-200
                relative text-center
              "
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3 mb-4">
                <Image
                  src="/08/clean-up-list.png"
                  alt="Mascot"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
                <h3 className="text-lg font-semibold">
                  Clean up Shopping List?
                </h3>
              </div>

              {/* Body */}
              <p className="text-sm text-gray-600 mb-6">
                This will delete <strong>all items</strong> permanently.
              </p>

              {/* Actions */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 
                        0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Confirm</span>
                    </>
                  )}
                </button>
              </div>

              {/* Success overlay */}
              {showConfirmation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-100 bg-opacity-90 rounded-lg"
                >
                  <span className="text-green-600 font-semibold">
                    List Cleaned Up!
                  </span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CleanupDropdown;
