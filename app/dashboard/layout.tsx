"use client";

import React from "react";
import DashboardLayout from "../dashboards/layout";

interface MainDashboardLayoutProps {
  children: React.ReactNode;
}

const MainDashboardLayout: React.FC<MainDashboardLayoutProps> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default MainDashboardLayout;
