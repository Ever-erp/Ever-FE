import React from "react";
import "../../assets/styles/global.css";

const Loading = ({
  size = 40,
  color = "#3b82f6",
  text = "",
  className = "",
  fullscreen = false,
}) => {
  const containerClass = fullscreen
    ? `fixed inset-0 flex flex-col items-center justify-center gap-3 bg-white bg-opacity-90 z-50 ${className}`
    : `flex flex-col items-center justify-center gap-3 min-h-[200px] ${className}`;

  return (
    <div className={containerClass}>
      <div
        className="loading-spinner rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `3px solid rgba(59, 130, 246, 0.1)`,
          borderTop: `3px solid ${color}`,
        }}
      />
      {text && <p className="text-sm text-gray-500 font-medium m-0">{text}</p>}
    </div>
  );
};

export default Loading;
