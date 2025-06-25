import React from "react";
import SignUpForm from "../components/specific/signup/SignupForm";
import FullScreenContainer from "../layouts/FullScreenContainer";
import VideoLoop from "../components/specific/intro-video/VideoLoop";

const Auth = () => {
  const user = useSelector((state) => state.user);
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);

  if (user?.isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <FullScreenContainer>
      {!isSignUpComplete ? (
        <SignUpForm onSignupSuccess={() => setIsSignUpComplete(true)} /> // 회원가입
      ) : (
        <LoginForm /> // 로그인 폼
      )}
      <VideoLoop /> {/* 오토에버 소개영상 */}
    </FullScreenContainer>
  );
};

export default Auth;
