import { useState } from "react";

const LoginForm = () => {
  // 전체 폼 데이터 상태 (계정 + 프로필 + 클래스)
  const [member, setMember] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="w-[40%] min-w-[480px] flex justify-center items-center"></div>
  );
};

export default LoginForm;
