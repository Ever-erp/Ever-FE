import React, { useState } from 'react';
import CustomDropdown from '../../common/CustomDropdown';
const CategorySelectBar = ({ onCategoryChange }) => {
  const [category, setCategory] = useState('all');

  const categoryOptions = [
    { value: 'title', label: '제목' },
    { value: 'writer', label: '작성자' },
  ];

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);

    if (onCategoryChange) {
      onCategoryChange(selectedCategory);
    }
  };

  return (
    <div className="mr-4 text-center font-semibold text-brand">
      <CustomDropdown
        options={categoryOptions}
        value={category}
        onChange={handleCategoryChange}
        placeholder="제목"
        width="w-32"
        className="rounded-md"
      />
    </div>
  );
};

export default CategorySelectBar;
