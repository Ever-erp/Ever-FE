import React from "react";
import { useState } from "react";
import CustomInput from "@/components/common/CustomInput";
import SignupHeader from "../../auth/AuthHeader";
import CustomButton from "../../../common/CustomButton";

const SignupAccountInfo = ({ member, updateMember, onNext }) => {
  const handleChange = (field, value) => {
    updateMember(field, value);
  };

  const handleNext = (e) => {
    onNext?.(); // 유저 프로필 정보 입력으로 이동
  };

  return (
    <div className="w-full">
      <CustomInput
        label="이메일"
        placeholder="example@email.com"
        value={member.email}
        onChange={(val) => handleChange("email", val)}
      />
      <CustomInput
        label="비밀번호"
        placeholder="********"
        value={member.password}
        onChange={(val) => handleChange("password", val)}
        type="password"
      />
      <CustomInput
        label="비밀번호 확인"
        placeholder="********"
        value={member.passwordCheck}
        onChange={(val) => handleChange("passwordCheck", val)}
        type="password"
      />
      <CustomInput
        label="이름"
        placeholder="홍길동"
        value={member.name}
        onChange={(val) => handleChange("name", val)}
      />
      <CustomInput
        label="전화번호"
        placeholder="010-1234-5678"
        value={member.phone}
        onChange={(val) => handleChange("phone", val)}
        type="phone"
      />
      <CustomButton
        label="다음"
        onClick={handleNext}
        className="mt-10 py-3 rounded-lg"
        variant="primary"
        size="md"
      />
    </div>
  );
};

export default SignupAccountInfo;
