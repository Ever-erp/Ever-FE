import { useState } from "react";
import CustomInputContainer from "./CustomInputContainer";

const CustomInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) => {
  const [focused, setFocused] = useState(false);
  const isValid = focused || value;

  return (
    <CustomInputContainer label={label} isValid={isValid} isFocus={focused}>
      {/* input 박스 */}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full text-gray-800 focus:outline-none`}
      />
    </CustomInputContainer>
  );
};

export default CustomInput;
