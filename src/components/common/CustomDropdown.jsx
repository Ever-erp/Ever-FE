import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  width = 'w-32',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    setIsOpen(false);
    if (onChange) {
      onChange(selectedValue);
    }
  };

  const selectedOption = options.find((option) => option.value === value);

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between ${width} px-4 py-2 text-brand font-semibold border border-brand rounded-md bg-white transition-colors duration-200 ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
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
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              transition={{ duration: 0.15 }}
            >
              {options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    index === 0 ? 'rounded-t-md' : ''
                  } ${index === options.length - 1 ? 'rounded-b-md' : ''} ${
                    value === option.value
                      ? 'text-brand font-semibold bg-blue-50'
                      : 'text-gray-700'
                  }`}
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

export default CustomDropdown;
