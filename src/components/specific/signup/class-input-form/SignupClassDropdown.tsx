import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

// 드롭다운 항목 타입
interface DropdownOption {
  label: string;
  value: number;
}

// props 타입 정의
interface SignupClassDropdownProps {
  options: DropdownOption[];
  value: number | string | null;
  onChange: (value: number) => void;
  placeholder?: string;
  width?: string;
  className?: string;
  disabled?: boolean;
}

const SignupClassDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  width = "w-32",
  className = "",
  disabled = false,
}: SignupClassDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림/닫힘
  const isValid = Boolean(value); // 값이 있으면 유효
  const isFocus = isOpen; // 열려있으면 focus

  const handleSelect = (selectedValue: number) => {
    setIsOpen(false);
    if (onChange) onChange(selectedValue);
  };

  const selectedOption = options.find((option) => option.value === value);

  // 스타일 동적 처리
  const borderColor = isValid ? "border-brand" : "border-gray-300";
  const textColor = isValid ? "text-brand" : "text-gray-400";
  const fontWeight = isFocus ? "font-medium" : "font-normal";
  const ringStyle = isFocus ? "ring-1 ring-brand" : "";

  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between ${width} px-4 py-2 border rounded-md bg-white transition-colors duration-200
          ${borderColor} ${textColor} ${fontWeight} ${ringStyle}
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-50"
          }
        `}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className={`absolute top-full left-0 ${width} mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {options.map((option, index) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                    ${index === 0 ? "rounded-t-md" : ""}
                    ${index === options.length - 1 ? "rounded-b-md" : ""}
                    ${
                      value === option.value
                        ? "text-brand font-semibold bg-blue-50"
                        : "text-gray-700"
                    }
                  `}
                >
                  <span className="truncate block">{option.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignupClassDropdown;
