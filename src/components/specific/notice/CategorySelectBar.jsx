import React, { useState } from "react";
import CustomDropdown from "../../common/CustomDropdown";

const CategorySelectBar = ({ onCategoryChange, categoryOptions }) => {
  const [targetRange, setTargetRange] = useState("ALL_TARGETRANGE");
  const [noticeType, setNoticeType] = useState("ALL_TYPE");
  const [singleCategory, setSingleCategory] = useState("all");

  const handleTargetRangeChange = (selectedTargetRange) => {
    setTargetRange(selectedTargetRange);

    if (onCategoryChange) {
      onCategoryChange({ targetRange: selectedTargetRange, type: noticeType });
    }
  };

  const handleTypeChange = (selectedType) => {
    setNoticeType(selectedType);

    if (onCategoryChange) {
      onCategoryChange({ targetRange: targetRange, type: selectedType });
    }
  };

  const handleSingleCategoryChange = (selectedCategory) => {
    setSingleCategory(selectedCategory);

    if (onCategoryChange) {
      onCategoryChange(selectedCategory);
    }
  };

  // categoryOptions가 배열 하나만 있는 경우 (Survey 페이지)
  if (categoryOptions.length === 1) {
    return (
      <div className="mr-4 text-center font-semibold text-brand">
        <CustomDropdown
          options={categoryOptions[0]}
          value={singleCategory}
          onChange={handleSingleCategoryChange}
          placeholder="제목"
          width="w-32"
          className="rounded-md"
        />
      </div>
    );
  }

  // categoryOptions가 배열 2개 있는 경우 (Notice 페이지)
  return (
    <div className="mr-4 text-center font-semibold text-brand flex gap-4">
      <CustomDropdown
        options={categoryOptions[0]}
        value={targetRange}
        onChange={handleTargetRangeChange}
        placeholder="대상 범위"
        width="w-32"
        className="rounded-md"
      />
      <CustomDropdown
        options={categoryOptions[1]}
        value={noticeType}
        onChange={handleTypeChange}
        placeholder="타입"
        width="w-32"
        className="rounded-md"
      />
    </div>
  );
};

export default CategorySelectBar;
