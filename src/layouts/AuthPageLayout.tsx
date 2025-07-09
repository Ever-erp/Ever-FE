import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import FullScreenContainer from "./FullScreenContainer";
import VideoLoop from "../components/specific/intro-video/VideoLoop";

type Props = {
  children: ReactNode;
};

const AuthPageLayout = ({ children }: Props) => {
  return (
    <FullScreenContainer>
      {children}
      <VideoLoop /> {/* 오토에버 소개영상 */}
    </FullScreenContainer>
  );
};

export default AuthPageLayout;
