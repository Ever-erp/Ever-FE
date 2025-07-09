import React, { useEffect, useState } from "react";
import CustomInput from "../../../common/CustomInput";
import CustomButton from "../../../common/CustomButton";

interface MemberInfo {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
  phone: string;
}

interface SignupAccountInfoProps {
  member: MemberInfo;
  updateMember: (field: keyof MemberInfo, value: string) => void;
  onNext?: () => void;
}

interface Errors {
  email?: string;
  password?: string;
  passwordCheck?: string;
  name?: string;
  phone?: string;
}

const SignupAccountInfo = ({
  member,
  updateMember,
  onNext,
}: SignupAccountInfoProps) => {
  const [errors, setErrors] = useState<Errors>({});
  const [isValid, setIsValid] = useState(false);

  const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^.{8,}$/,
    name: /^.{2,}$/,
    phone: /^01[016789][0-9]{7,8}$/, // 하이픈 없이 총 10~11자리
  };

  // 유효성 검사
  useEffect(() => {
    const newErrors: Errors = {};

    if (!regex.email.test(member.email))
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    if (!regex.password.test(member.password))
      newErrors.password = "비밀번호는 8자리 이상이어야 합니다.";
    if (member.password !== member.passwordCheck)
      newErrors.passwordCheck = "비밀번호가 일치하지 않습니다.";
    if (!regex.name.test(member.name))
      newErrors.name = "이름은 2자 이상 입력해주세요.";
    if (!regex.phone.test(member.phone))
      newErrors.phone = "전화번호는 10~11자리 숫자만 입력해주세요.";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [member]);

  const handleChange = (field: keyof MemberInfo, value: string) => {
    updateMember(field, value);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isValid) {
      onNext?.();
    } else {
      alert("입력한 정보를 다시 확인해주세요.");
    }
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
      <CustomInput
        label="비밀번호 확인"
        placeholder="********"
        value={member.passwordCheck}
        onChange={(val) => handleChange("passwordCheck", val)}
        type="password"
        error={errors.passwordCheck}
      />
      <CustomInput
        label="이름"
        placeholder="홍길동"
        value={member.name}
        onChange={(val) => handleChange("name", val)}
        error={errors.name}
      />
      <CustomInput
        label="전화번호"
        placeholder="01012345678"
        value={member.phone}
        onChange={(val) => handleChange("phone", val)}
        type="phone"
        error={errors.phone}
      />
      <CustomButton
        label="다음"
        onClick={handleNext}
        className="mt-10 py-3 rounded-lg"
        variant="brand"
      />
    </div>
  );
};

export default SignupAccountInfo;
