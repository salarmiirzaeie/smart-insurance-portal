import React from "react";
import { Routes, Route } from "react-router-dom";
import FormPage from "../pages/FormPage";
import SubmissionsPage from "../pages/SubmissionsPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/submissions" element={<SubmissionsPage />} />
    </Routes>
  );
};

export default AppRoutes;
