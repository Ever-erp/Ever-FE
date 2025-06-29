import React, { useEffect, useState } from "react";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";

const LoginAccountInfo = ({ member, updateMember, errors, setErrors }) => {
  const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^.{8,}$/,
  };
  // 유효성 검사
  useEffect(() => {
    const newErrors = {};

    if (!regex.email.test(member.email))
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    if (!regex.password.test(member.password))
      newErrors.password = "비밀번호는 8자리 이상이어야 합니다.";

    setErrors(newErrors);
  }, [member]);

  const handleChange = (field, value) => {
    updateMember(field, value);
  };
  return (
    <div className="w-full">
      <CustomInput
        label="이메일"
        placeholder="example@email.com"
        value={member.email}
        onChange={(val) => handleChange("email", val)}
        error={errors.email}
      />
      <CustomInput
        label="비밀번호"
        placeholder="********"
        value={member.password}
        onChange={(val) => handleChange("password", val)}
        type="password"
        error={errors.password}
      />
      <CustomButton
        label="로그인"
        className="mt-10 py-3"
        variant="primary"
        size="md"
        type="submit"
      />
    </div>
  );
};

export default LoginAccountInfo;
