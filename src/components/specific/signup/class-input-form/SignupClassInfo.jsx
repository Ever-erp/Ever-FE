import React from "react";
import { useState } from "react";
import CustomInput from "@/components/common/CustomInput";
import SignupHeader from "../../auth/AuthHeader";
import CustomButton from "../../../common/CustomButton";

const SignupClassInfo = ({ member, updateMember, onPrev }) => {
  const handleChange = (field, value) => {
    updateMember(field, value);
  };

  const handlePrev = (e) => {
    console.log("회원가입 데이터:", member);
    onPrev?.(); // 유저 프로필 정보 입력으로 이동
  };
  return (
    <div className="w-full">
      <CustomInput label="반 이름" value={member.className} />
      <CustomInput label="기수" value={member.classCohort} />
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
