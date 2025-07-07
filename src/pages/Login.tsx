import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthSwitchPrompt from "../components/specific/auth/AuthSwitchPrompt";
import AuthHeader from "../components/specific/auth/AuthHeader";
import LoginAccountInfo from "../components/specific/login/LoginAccountInfo";
import { setUser } from "../store/userSlice";

// 로그인 입력값 타입
interface LoginMember {
  email: string;
  password: string;
}

// 오류 메시지 타입 (키-문자열 구조)
type ErrorMap = {
  [key: string]: string;
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 폼 제출 중일 때 중복막기
  const [errors, setErrors] = useState<ErrorMap>({});

  const [member, setMember] = useState<LoginMember>({
    email: "",
    password: "",
  });

  const updateMember = (field: keyof LoginMember, value: string) => {
    setMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member.email || !member.password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      alert("입력한 정보를 다시 확인해주세요.");
      return;
    }
    if (isSubmitting) return; // 이미 요청 중이면 무시
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: member.email,
          pwd: member.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("로그인 실패: " + errorData.message);
        return;
      }

      const res = await response.json();
      alert(
        "로그인 성공! 환영합니다, " + res.data.memberResponseDto.name + "님"
      );
      dispatch(setUser(res.data.memberResponseDto));
      localStorage.setItem("accessToken", res.data.tokenDto.accessToken);
      localStorage.setItem("refreshToken", res.data.tokenDto.refreshToken);
      navigate("/calendar"); // 메인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[40%] min-w-[480px] flex justify-center items-center">
      <div className="w-full max-w-lg flex flex-col gap-4 px-4 mb-12">
        <AuthHeader
          type="로그인"
          text="Log in to join the journey with Ever."
        />
        <form onSubmit={handleSubmit} className="w-full">
          <LoginAccountInfo
            member={member}
            updateMember={updateMember}
            errors={errors}
            setErrors={setErrors}
          />
        </form>
        <AuthSwitchPrompt
          message="계정이 없으신가요?"
          path="/signup"
          text="회원가입"
        />
      </div>
    </div>
  );
};

export default Login;
