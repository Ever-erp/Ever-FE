import React from "react";
import SignUpForm from "../components/specific/signup/SignUpForm";
import FullScreenContainer from "../layouts/FullScreenContainer";
import VideoLoop from "../components/specific/intro-video/VideoLoop";

const Signup = () => {
  return (
    <FullScreenContainer>
      <SignUpForm /> {/* 회원가입 폼 */}
      <VideoLoop /> {/* 오토에버 소개영상 */}
    </FullScreenContainer>
  );
};

export default Signup;
