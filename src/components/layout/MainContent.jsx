import React from "react";

const MainContent = ({ children }) => {
  return (
    <main className="bg-gray-150 h-full p-3 2xl:p-5 rounded-xl">
      <div className="bg-white w-full h-full p-3 pt-0 2xl:p-5 rounded-xl overflow-y-scroll flex justify-center items-center">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
