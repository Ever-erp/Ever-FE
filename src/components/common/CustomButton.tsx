import React, {
  MouseEventHandler,
  FocusEventHandler,
  ButtonHTMLAttributes,
} from "react";

type Variant =
  | "brand"
  | "outline"
  | "gray"
  | "brandDisabled"
  | "outlineDisabled"
  | "positive";
type Rounded = "rounded-md" | "rounded-sm" | "rounded-lg" | string;

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Variant;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  className?: string;
  rounded?: Rounded;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

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
  disabled = false,
  ...props
}: CustomButtonProps) => {
  // variant별 스타일 맵
  const variantStyles: Record<Variant, string> = {
    brand: "bg-brand text-white hover:bg-opacity-90",
    outline: "bg-white border border-brand text-brand hover:bg-gray-150",
    gray: "bg-white border border-gray-300 text-gray-500 hover:bg-gray-200 hover:text-gray-500",
    brandDisabled: "bg-disabled text-white",
    outlineDisabled: "bg-white border border-disabled text-disabled",
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
      disabled={disabled || variant.includes("Disabled")} // disabled를 명시적으로 지정 or 글자 포함
      className={`w-full font-medium py-2 px-4 hover:bg-opacity-90 transition ${variantStyle} ${rounded} ${className} `}
      {...props}
    >
      {label}
    </button>
  );
};

export default CustomButton;
