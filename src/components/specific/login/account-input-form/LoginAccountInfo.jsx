import React from "react";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";

const LoginAccountInfo = ({ member, updateMember }) => {
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
      />
      <CustomInput
        label="비밀번호"
        placeholder="********"
        value={member.password}
        onChange={(val) => handleChange("password", val)}
        type="password"
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
