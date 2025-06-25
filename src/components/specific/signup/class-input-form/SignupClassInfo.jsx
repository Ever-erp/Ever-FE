import React, { useEffect } from "react";
import { useState } from "react";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "../../../common/CustomButton";
import SignupClassDropdown from "./SignupClassDropdown";

const SignupClassInfo = ({ member, classList, updateMember, onPrev }) => {
  const [isValid, setIsValid] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    if (selectedClass !== null && classList[selectedClass] !== undefined) {
      updateMember("className", classList[selectedClass].full.name);
      updateMember("classCohort", classList[selectedClass].full.cohort);
    }
  }, [selectedClass]);

  const handlePrev = (e) => {
    onPrev?.(); // 유저 프로필 정보 입력으로 이동
  };
  return (
    <div className="w-full mt-10">
      <SignupClassDropdown
        options={classList}
        value={selectedClass}
        onChange={(value) => {
          setSelectedClass(value);
        }}
        width={"w-full py-3"}
        placeholder="소속된 반을 선택하세요"
        isValid={!!classList} // 유효하면 색상 변경
        onFocusChange={setIsFocus} // ✅ focus 상태 전달받기
      />

      <CustomInput
        label="기수"
        isValid={isValid}
        isReadonly={true}
        value={
          member.classCohort
          // selectedClass !== null ? classList[selectedClass].full.cohort : ""
        }
      />

      <div className="w-full flex gap-4 mt-10">
        <CustomButton
          label="이전"
          onClick={handlePrev}
          className="w-1/5 py-3 rounded-lg"
          variant="outline"
          size="md"
        />
        <CustomButton
          label="회원가입"
          className="py-3 rounded-lg"
          variant="brand"
          size="md"
          type="submit"
        />
      </div>
    </div>
  );
};

export default SignupClassInfo;
