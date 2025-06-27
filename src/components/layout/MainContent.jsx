import React from "react";

const MainContent = ({ children }) => {
  return (
    <main className="flex-1 bg-gray-150 h-full p-[1vw] rounded-xl">
      {children}
      {/* <div className="bg-white w-full h-full p-6 rounded-xl flex justify-center items-center"></div> */}
    </main>
  );
};

export default MainContent;
