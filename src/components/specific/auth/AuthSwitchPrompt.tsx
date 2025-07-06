import React from "react";
import { Link } from "react-router-dom";

interface AuthSwitchPromptProps {
  message: string;
  path: string;
  text: string;
}

// 로그인 / 회원가입 전환 안내 문구
const AuthSwitchPrompt = ({ message, path, text }: AuthSwitchPromptProps) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="text-center text-gray-500">{message}</div>
      <Link
        to={path}
        className="text-brand font-medium underline underline-offset-2"
      >
        {text}
      </Link>
    </div>
  );
};

export default AuthSwitchPrompt;
