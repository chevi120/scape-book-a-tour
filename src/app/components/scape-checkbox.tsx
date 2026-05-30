"use client";

import * as React from "react";

interface ScapeCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function ScapeCheckbox({
  id,
  checked,
  onCheckedChange,
  children,
  className = "",
}: ScapeCheckboxProps) {
  return (
    <div className={`flex w-full ${className}`}>
      <div>
        <label className="flex select-none md:items-start items-start cursor-pointer">
          <span
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
            onClick={() => onCheckedChange(!checked)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCheckedChange(!checked);
              }
            }}
            className={`w-[24px] h-[24px] mr-[12px] flex items-center justify-center border-2 rounded-[4px] transition-all duration-200 mt-[2px] ${
              checked
                ? "bg-[#FF007F] border-[#FF007F]"
                : "border-[#FFDDEE] bg-white hover:border-[#FF007F]"
            }`}
          >
            {checked && (
              <svg
                className="w-[20px] h-[20px] text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </span>
          <span className="privacy-text w-[calc(100%-36px)] text-[#222423] text-[18px] not-italic font-normal leading-[120%]">
            {children}
          </span>
        </label>
      </div>
    </div>
  );
}
