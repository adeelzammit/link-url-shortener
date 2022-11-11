import { Suspense } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { routes } from "../../../common/reactRoutes/reactRoutes";
import Home from "../../Home/Home";
import UILayout from "../UILayout/UILayout";

const RouteLayout = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <UILayout>
          <Routes>
            <Route path="/" element={<Navigate to={routes.home} replace />} />
            <Route path={routes.home} element={<Home />} />
          </Routes>
        </UILayout>
      </BrowserRouter>
    </Suspense>
  );
};

export default RouteLayout;
