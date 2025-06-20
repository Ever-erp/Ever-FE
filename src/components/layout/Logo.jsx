import React from "react";
import brandLogo from "@/assets/images/brand-logo.png"; // @는 tsconfig에서 baseUrl이 src로 설정되어 있다고 가정

const Logo = () => {
  return (
    <div className="h-[10%] min-h-20 p-[15%] flex items-center">
      <img src={brandLogo} alt="Band Logo" />
    </div>
  );
};

export default Logo;
