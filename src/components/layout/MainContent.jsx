import React from "react";

const MainContent = ({ children }) => {
  return (
    <main className="bg-gray-150 h-full p-6 rounded-xl">
      <div className="bg-white w-full h-full p-6 rounded-xl overflow-y-scroll flex justify-center items-center">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
