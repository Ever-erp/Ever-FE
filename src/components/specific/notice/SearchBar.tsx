"use client";
import React, { useState } from "react";

interface SearchBarProps {
  onSearchChange: (searchValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSearchChange) {
      onSearchChange(inputValue);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-row gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="border border-brand rounded-md p-2 w-[600px] focus:outline-none focus:ring-1 focus:ring-brand"
        />
        <button
          type="submit"
          className="bg-brand text-white px-4 py-2 rounded-md w-32 hover:bg-brand/80 transition-colors btn-click"
        >
          검색
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
