import { useState } from "react";
import AuthSwitchPrompt from "../auth/AuthSwitchPrompt";
import AuthHeader from "../auth/AuthHeader";
import CustomInput from "../../common/CustomInput";
import LoginAccountInfo from "./account-input-form/LoginAccountInfo";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/userSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // 폼 제출 중일 때 중복막기
  const [errors, setErrors] = useState({});

  const [member, setMember] = useState({
    email: "",
    password: "",
  });

  const updateMember = (field, value) => {
    setMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
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
        console.log(errorData);
        alert("로그인 실패: " + errorData.message);
        return;
      }

      const res = await response.json();
      console.log("로그인 후 데이터: ", res);
      console.log(res.data);
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

export default LoginForm;
