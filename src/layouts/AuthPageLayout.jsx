import React from "react";
import { Outlet } from "react-router-dom";
import VideoLoop from "../components/specific/intro-video/VideoLoop";
import FullScreenContainer from "./FullScreenContainer";

const AuthPageLayout = ({ children }) => {
  return (
    <FullScreenContainer>
      {children}
      <VideoLoop /> {/* 오토에버 소개영상 */}
    </FullScreenContainer>
  );
};

export default AuthPageLayout;
