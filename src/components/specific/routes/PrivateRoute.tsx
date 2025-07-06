import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../../store/store";

type Props = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
