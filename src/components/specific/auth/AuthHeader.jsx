import React from "react";
import Logo from "../../layout/Logo";

const AuthHeader = ({ type, text }) => {
  return (
    <div className="flex flex-col gap-2">
      <Logo className="w-56 pb-12" />
      <div className="text-4xl font-semibold text-gray-800">{type}</div>
      <div className="text-gray-300">{text}</div>
    </div>
  );
};

export default AuthHeader;
