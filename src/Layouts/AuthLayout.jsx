import React from "react";
import { useUserAuth } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { user } = useUserAuth();
  if (user) return <Navigate to={"/"} />;
  return <Outlet />;
};

export default AuthLayout;
