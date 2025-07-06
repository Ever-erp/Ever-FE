import React, { useEffect, useState } from "react";
import SignupClassDropdown from "./SignupClassDropdown";
import CustomButton from "../../../common/CustomButton";
import CustomInput from "../../../common/CustomInput";

interface ClassItem {
  name: string;
  cohort: string;
}

interface ClassOption {
  label: string;
  value: number;
  full: ClassItem;
}

interface MemberInfo {
  className: string;
  classCohort: string;
}

interface SignupAccountInfoProps {
  member: MemberInfo;
  classList: ClassOption[];
  updateMember: (field: keyof MemberInfo, value: string) => void;
  onPrev?: () => void;
}

const SignupClassInfo = ({
  member,
  classList,
  updateMember,
  onPrev,
}: SignupAccountInfoProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  // 초기 렌더 시 className을 바탕으로 selectedClass 복구
  useEffect(() => {
    if (member.className && classList.length > 0) {
      const found = classList.find(
        (item) => item.full.name === member.className
      );
      if (found) {
        setSelectedClass(found.value);
      }
    }
  }, [member.className, classList]);

  // 선택된 반이 변경될 때 member 값 업데이트
  useEffect(() => {
    if (selectedClass !== null && classList[selectedClass] !== undefined) {
      updateMember("className", classList[selectedClass].full.name);
      updateMember("classCohort", classList[selectedClass].full.cohort);
    }
  }, [selectedClass]);

  const handlePrev = () => {
    onPrev?.(); // 유저 프로필 정보 입력으로 이동
  };

  return (
    <div className="w-full mt-10">
      <SignupClassDropdown
        options={classList}
        value={selectedClass}
        onChange={(value: number) => {
          setSelectedClass(value);
        }}
        width={"w-full py-3"}
        placeholder="소속된 반을 선택하세요"
      />

      <CustomInput
        label="기수"
        isReadonly={true}
        value={
          member.classCohort
          // selectedClass !== null ? classList[selectedClass].full.cohort : ""
        }
        onChange={() => {}}
      />

      <div className="w-full flex gap-4 mt-10">
        <CustomButton
          label="이전"
          onClick={handlePrev}
          className="w-1/5 py-3 rounded-lg"
          variant="outline"
        />
        <CustomButton
          label="회원가입"
          className="py-3 rounded-lg"
          variant="brand"
          type="submit"
        />
      </div>
    </div>
  );
};

export default SignupClassInfo;
