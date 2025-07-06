import React from "react";
import brandLogo from "@/assets/images/brand-logo.png"; // @는 tsconfig에서 baseUrl이 src로 설정되어 있다고 가정

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={className}>
      <img src={brandLogo} alt="Band Logo" />
    </div>
  );
};

export default Logo;
