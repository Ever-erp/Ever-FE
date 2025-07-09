import React, { useEffect, useState } from "react";
import CustomInput from "../../common/CustomInput";
import CustomButton from "../../common/CustomButton";

interface LoginMember {
  email: string;
  password: string;
}

type ErrorMap = {
  [key: string]: string;
};

interface LoginAccountInfoProps {
  member: LoginMember;
  updateMember: (field: keyof LoginMember, value: string) => void;
  errors: ErrorMap;
  setErrors: (errors: ErrorMap) => void;
}

const LoginAccountInfo = ({
  member,
  updateMember,
  errors,
  setErrors,
}: LoginAccountInfoProps) => {
  const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^.{8,}$/,
  };
  // 유효성 검사
  useEffect(() => {
    const newErrors: ErrorMap = {};

    if (!regex.email.test(member.email))
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    if (!regex.password.test(member.password))
      newErrors.password = "비밀번호는 8자리 이상이어야 합니다.";

    setErrors(newErrors);
  }, [member]);

  const handleChange = (field: keyof LoginMember, value: string) => {
    updateMember(field, value);
  };
  return (
    <div className="w-full">
      <CustomInput
        label="이메일"
        placeholder="example@email.com"
        value={member.email}
        onChange={(val: string) => handleChange("email", val)}
        error={errors.email}
      />
      <CustomInput
        label="비밀번호"
        placeholder="********"
        value={member.password}
        onChange={(val: string) => handleChange("password", val)}
        type="password"
        error={errors.password}
      />
      <CustomButton
        label="로그인"
        className="mt-10 py-3"
        variant="brand"
        type="submit"
      />
    </div>
  );
};

export default LoginAccountInfo;
