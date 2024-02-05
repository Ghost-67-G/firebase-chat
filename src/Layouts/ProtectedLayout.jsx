import React from "react";
import { useUserAuth } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { user } = useUserAuth();
  if (!user) return <Navigate to={"/login"} />;
  return <Outlet />;
};

export default ProtectedLayout;
