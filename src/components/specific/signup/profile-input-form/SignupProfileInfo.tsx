import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import BirthInput from "./BirthInput";
import GenderInput from "./GenderInput";
import ImageInput from "./ImageInput";
import CustomInput from "../../../common/CustomInput";
import CustomButton from "../../../common/CustomButton";

interface MemberInfo {
  birth: string;
  gender: string;
  image: File | null;
  addr: string;
}

interface Errors {
  birth?: string;
  gender?: string;
}

interface SignupProfileInfoProps {
  member: MemberInfo;
  updateMember: (field: keyof MemberInfo, value: string | File | null) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const SignupProfileInfo = ({
  member,
  updateMember,
  onNext,
  onPrev,
}: SignupProfileInfoProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const newErrors: Errors = {};

    if (!member.birth) {
      newErrors.birth = "생년월일을 선택해주세요.";
    }

    if (!member.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validate()) {
      onNext?.();
    } else {
      alert("입력값을 확인해주세요.");
    }
  };

  const handlePrev = (): void => {
    onPrev?.(); // 이전 화면으로 이동
  };

  return (
    <div className="w-full">
      <BirthInput
        birth={member.birth}
        setBirth={(val: string) => updateMember("birth", val)}
        error={errors.birth}
      />
      <GenderInput
        gender={member.gender}
        setGender={(val: string) => updateMember("gender", val)}
        error={errors.gender}
      />
      <ImageInput
        image={member.image}
        setImage={(val: File | null) => updateMember("image", val)}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
      />
      <CustomInput
        label="주소"
        placeholder="서울특별시 금천구"
        value={member.addr}
        onChange={(val) => updateMember("addr", val)}
      />
      <div className="w-full flex gap-4 mt-10">
        <CustomButton
          label="이전"
          onClick={handlePrev}
          className="w-1/5 py-3 rounded-lg"
          variant="outline"
        />
        <CustomButton
          label="다음"
          onClick={handleNext}
          className="py-3 rounded-lg"
          variant="brand"
        />
      </div>
    </div>
  );
};

export default SignupProfileInfo;
