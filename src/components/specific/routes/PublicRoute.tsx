import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../../store/store";

type Props = {
  children: ReactNode;
};

const PublicRoute = ({ children }: Props) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  if (isLoggedIn) {
    // 로그인된 상태면 메인 페이지로 리다이렉트
    return <Navigate to="/calendar" replace />;
  }

  return children;
};

export default PublicRoute;
