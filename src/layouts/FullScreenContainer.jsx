import React from "react";

const FullScreenContainer = ({ children, className }) => {
  return (
    <div className={`w-screen h-screen flex ${className}`}>{children}</div>
  );
};

export default FullScreenContainer;
