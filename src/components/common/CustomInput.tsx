import React, { ChangeEvent, useState } from "react";
import CustomInputContainer from "./CustomInputContainer";

interface CustomInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  isReadonly?: boolean;
  error?: string;
}

const CustomInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  isReadonly = false,
  error,
}: CustomInputProps) => {
  const [focused, setFocused] = useState<boolean>(false);
  const isValid = focused || value.length > 0;

  return (
    <div className="w-full">
      <CustomInputContainer label={label} isValid={isValid} isFocus={focused}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className="w-full text-gray-800 focus:outline-none"
          readOnly={isReadonly}
        />
      </CustomInputContainer>
      {/* 에러 메시지 출력 */}
      {value && error && (
        <p className="mt-1 ml-2 text-sm text-warning">{error}</p>
      )}
    </div>
  );
};

export default CustomInput;
