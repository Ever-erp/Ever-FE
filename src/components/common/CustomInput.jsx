import { useState } from "react";
import CustomInputContainer from "./CustomInputContainer";

const CustomInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  isReadonly = false,
  error, // ← 추가
}) => {
  const [focused, setFocused] = useState(false);
  const isValid = focused || value;

  return (
    <div className="w-full">
      <CustomInputContainer label={label} isValid={isValid} isFocus={focused}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-gray-800 focus:outline-none"
          readOnly={isReadonly}
        />
      </CustomInputContainer>
      {/* 에러 메시지 출력 */}
      {value && error && (
        <p className="mt-1 ml-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CustomInput;
