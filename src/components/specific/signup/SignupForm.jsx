import React, { useEffect, useState, useSyncExternalStore } from "react";
import SignupAccountInfo from "./account-input-form/SignupAccountInfo";
import SignupProfileInfo from "./profile-input-form/SignupProfileInfo";
import SignupClassInfo from "./class-input-form/SignupClassInfo";
import AuthSwitchPrompt from "../auth/AuthSwitchPrompt";
import AuthHeader from "../auth/AuthHeader";
import { uploadImageToFirebase } from "@/services/uploadImage"; // 이미지 업로드 함수 import
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [step, setStep] = useState(1); // 1단계: 계정 정보, 2단계: 프로필 정보, 3단계: 클래스 정보
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/class/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert("반 정보 로드 실패: " + errorData.message);
          return;
        }

        const res = await response.json();
        console.log(res);
        const formatted = res.data.map((item, index) => ({
          label: item.name,
          value: index,
          full: item, // 해당 반의 전체 정보 (name, cohort 등)
        }));
        setClassList(formatted);
      } catch (error) {
        console.error(error);
        alert("로그인 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("회원 정보:", member);
    try {
      const profileImageUrl = member.image
        ? await uploadImageToFirebase(member.image)
        : null;

      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: member.email,
          pwd: member.password,
          pwdCheck: member.passwordCheck,
          name: member.name,
          birth: member.birth,
          gender: member.gender,
          phone: member.phone,
          address: member.addr,
          classId: 1,
          // profileImage: profileImageUrl, // firebase에 업로드된 이미지 URL
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        alert("회원가입 실패: " + errorData.message);
        return;
      }

      const data = await response.json();
      console.log(data);
      alert("회원가입 성공! 환영합니다, " + data.name);
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-[40%] min-w-[480px] flex justify-center items-center">
      <div className="w-full max-w-lg flex flex-col gap-4 px-4 mb-12">
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
              classList={classList} // 백엔드에서 받아온 반(이름, 기수) 정보
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
