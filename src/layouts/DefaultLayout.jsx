import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";
import MainContent from "../components/layout/MainContent";

const DefaultLayout = () => {
  return (
    <div className="w-screen h-screen flex flex-row p-5 gap-4">
      <Sidebar />
      <div className="flex flex-col gap-4 flex-1">
        <Header />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};

export default DefaultLayout;
