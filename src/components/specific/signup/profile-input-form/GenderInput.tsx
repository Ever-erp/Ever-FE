import React, { useState, FocusEvent } from "react";
import GenderButton from "../../../common/CustomButton";
import CustomButton from "../../../common/CustomButton";
import CustomInputContainer from "../../../common/CustomInputContainer";

interface GenderInputProps {
  gender: string;
  setGender: (val: string) => void;
  error?: string;
}

const GenderInput = ({ gender, setGender, error }: GenderInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // 포커스/블러 처리 함수
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    const nextFocused = e.relatedTarget;
    if (!e.currentTarget.contains(nextFocused)) {
      setIsFocused(false);
    }
  };

  return (
    <>
      {/* 성별 */}
      <CustomInputContainer
        label="성별"
        isValid={!!gender} // 값이 설정되었는지
        isFocus={isFocused} // 포커스 중인지
      >
        <div
          tabIndex={-1} // div가 focus/blur 이벤트 받도록
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full flex gap-4"
        >
          <CustomButton
            label="남성"
            selected={gender === "남성"}
            onClick={() => setGender("남성")}
            variant="gray"
          />
          <CustomButton
            label="여성"
            selected={gender === "여성"}
            onClick={() => setGender("여성")}
            variant="gray"
          />
        </div>
      </CustomInputContainer>
      {/* 에러 메시지 출력 */}
      {!gender && error && (
        <p className="mt-1 ml-2 text-sm text-warning">{error}</p>
      )}
    </>
  );
};

export default GenderInput;
