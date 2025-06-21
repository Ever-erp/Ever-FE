import React, { useState, useSyncExternalStore } from "react";
import SignupAccountInfo from "./account-input-form/SignupAccountInfo";
import SignupProfileInfo from "./profile-input-form/SignupProfileInfo";
import SignupClassInfo from "./class-input-form/SignupClassInfo";
import AuthSwitchPrompt from "../auth/AuthSwitchPrompt";
import AuthHeader from "../auth/AuthHeader";
import Logo from "@/components/layout/Logo";

const SignUpForm = () => {
  const [step, setStep] = useState(1); // 1단계: 계정 정보, 2단계: 프로필 정보, 3단계: 클래스 정보

  // 전체 폼 데이터 상태 (계정 + 프로필 + 클래스)
  const [member, setMember] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
    phone: "",
    birth: "",
    gender: "",
    image: null,
    addr: "",
    className: "",
    classCohort: "",
  });

  const updateMember = (field, value) => {
    setMember((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원 정보:", member);
  };

  return (
    <div className="w-[40%] min-w-[480px] flex justify-center items-center">
      <div className="w-full max-w-lg flex flex-col gap-4 px-4 mb-12">
        <Logo className="w-56 pb-12" />
        <AuthHeader
          type="회원가입"
          text="Sign up to join the journey with Ever."
        />
        <form onSubmit={handleSubmit} className="w-full">
          {step === 1 && (
            <SignupAccountInfo
              member={member}
              updateMember={updateMember}
              onNext={nextStep}
            />
          )}
          {step === 2 && (
            <SignupProfileInfo
              member={member}
              updateMember={updateMember}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 3 && (
            <SignupClassInfo
              member={member}
              updateMember={updateMember}
              onPrev={prevStep}
            />
          )}
        </form>
        <AuthSwitchPrompt
          message="이미 계정이 있으신가요?"
          path="/login"
          text="로그인"
        />
      </div>
    </div>
  );
};

export default SignUpForm;
