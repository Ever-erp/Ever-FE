import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";
import MainContent from "../components/layout/MainContent";
import FullScreenContainer from "./FullScreenContainer";

const DefaultLayout = () => {
  return (
    <FullScreenContainer className="flex w-full p-5 gap-4 flex-row">
      <div className="w-[10%] min-w-[150px] h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col gap-4 flex-1 min-w-0 h-full">
        <div className="flex-shrink-0">
          <Header />
        </div>
        <div className="flex-1 min-h-0">
          <MainContent>
            <Outlet />
          </MainContent>
        </div>
      </div>
    </FullScreenContainer>
  );
};

export default DefaultLayout;
