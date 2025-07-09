import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const FullScreenContainer = ({ children, className }: Props) => {
  return (
    <div className={`w-screen h-screen flex ${className ?? ""}`}>
      {children}
    </div>
  );
};

export default FullScreenContainer;
