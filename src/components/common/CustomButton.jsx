import React from "react";

const CustomButton = ({
  label,
  variant = "brand", // "brand", "outline", "gray"
  selected = false,
  onClick,
  onFocus,
  onBlur,
  className = "",
  rounded = "rounded-md",
  type = "button",
  ...props
}) => {
  // variant별 스타일 맵
  const variantStyles = {
    brand: "bg-brand text-white hover:bg-opacity-90",
    outline: "bg-white border border-brand text-brand hover:bg-gray-150",
    gray: "bg-white border border-gray-300 text-gray-500 hover:bg-gray-200 hover:text-gray-500",
    brandDisabled: "bg-disabled text-white disabled",
    outlineDisabled: "bg-white border border-disabled text-disabled disabled",
    positive: "bg-positive text-brand hover:bg-opacity-90",
  };

  // 버튼이 선택되면 기본색 적용
  const variantStyle = selected
    ? variantStyles.brand
    : variantStyles[variant] || variantStyles.brand;

  return (
    <button
      type={type}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`w-full font-medium py-2 px-4 hover:bg-opacity-90 transition ${variantStyle} ${rounded} ${className} `}
      {...props}
    >
      {label}
    </button>
  );
};

export default CustomButton;
