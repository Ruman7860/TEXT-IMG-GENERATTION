import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContent";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectRoute;
