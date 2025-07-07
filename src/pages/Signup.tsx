import React, { useEffect, useState, useSyncExternalStore } from "react";
import AuthSwitchPrompt from "../components/specific/auth/AuthSwitchPrompt";
import AuthHeader from "../components/specific/auth/AuthHeader";
import { useNavigate } from "react-router-dom";
import { uploadImageToFirebase } from "../services/uploadImage";
import SignupAccountInfo from "../components/specific/signup/account-input-form/SignupAccountInfo";
import SignupProfileInfo from "../components/specific/signup/profile-input-form/SignupProfileInfo";
import SignupClassInfo from "../components/specific/signup/class-input-form/SignupClassInfo";

// 반 정보 타입
interface ClassItem {
  name: string;
  cohort: string;
}

interface ClassOption {
  label: string;
  value: number;
  full: ClassItem;
}

// 회원 정보 타입
interface MemberInfo {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  image: File | null;
  addr: string;
  className: string;
  classCohort: string;
}

const SignUp = () => {
  const [step, setStep] = useState<number>(1); // 1단계: 계정 정보, 2단계: 프로필 정보, 3단계: 클래스 정보
  const [classList, setClassList] = useState<ClassOption[]>([]);
  const navigate = useNavigate();

  // 전체 폼 데이터 상태 (계정 + 프로필 + 클래스)
  const [member, setMember] = useState<MemberInfo>({
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

  const updateMember = (
    field: keyof MemberInfo,
    value: MemberInfo[keyof MemberInfo]
  ) => {
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
        const formatted: ClassOption[] = res.data.map(
          (item: ClassItem, index: number) => ({
            label: item.name,
            value: index,
            full: item, // 해당 반의 전체 정보 (name, cohort 등)
          })
        );
        setClassList(formatted);
      } catch (error) {
        console.error(error);
        alert("로그인 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member.className || !member.classCohort) {
      alert("반을 선택해주세요.");
      return;
    }
    try {
      // 1. 회원 정보 서버에 저장 (이미지 URL 없이)
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
          className: member.className,
          cohort: member.classCohort,
          profileImage: null, // firebase에 업로드된 이미지 URL
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("회원가입 실패: " + errorData.message);
        return;
      }

      const res = await response.json();
      alert("회원가입 성공! 환영합니다, " + res.data.name + "님");

      // 2. 이미지가 있다면 이미지 업로드
      if (member.email && member.image) {
        const profileImageUrl = await uploadImageToFirebase(
          member.image,
          member.email
        );

        // 3. 서버에 이미지 URL 업데이트 요청
        const updateResponse = await fetch(
          `http://localhost:8080/auth/updateImage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: member.email,
              profileImage: profileImageUrl,
            }),
          }
        );

        if (!updateResponse) {
          alert("이미지 업데이트 실패");
          return;
        }
      }

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

export default SignUp;
