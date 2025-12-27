"use client";

import React, { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface CleanupDropdownProps {
  onClear: () => void;
  disabled?: boolean;
  open?: boolean; // optional or boolean
  onClose?: () => void; // optional callback
}

const CleanupDropdown: React.FC<CleanupDropdownProps> = ({ onClear, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600)); // simulate delay
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
        className={`sm:w-auto border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-600 
        hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition duration-200 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Trash2 className="h-4 w-4" />
       <span className="ml-1 text-sm hidden sm:inline">Clean Up List</span>
      </button>

      {/* Dropdown Modal (below button) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg p-6 w-72 shadow-md border border-gray-200 z-50 text-center"
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{ duration: 0.2 }}
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
              <h3 className="text-lg font-semibold">Clean up Shopping List?</h3>
            </div>

            {/* Body */}
            <p className="text-sm text-gray-600 mb-6">
              This will delete <strong>all items</strong> permanently.
            </p>

            {/* Actions */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                disabled={loading}
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 
                      0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Confirm</span>
                  </>
                )}
              </button>
            </div>

            {/* Success confirmation overlay */}
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-green-100 bg-opacity-80 rounded-lg"
              >
                <span className="text-green-600 font-semibold">List Cleaned Up!</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CleanupDropdown;
