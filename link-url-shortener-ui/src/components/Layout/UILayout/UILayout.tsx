import React from "react";
import { AppThemeContext } from "../../../context/AppThemeContext";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import "./UILayout.scss";

export interface UILayoutProps {
  children: JSX.Element;
}

const UILayout = ({ children }: UILayoutProps) => {
  const { appTheme } = React.useContext(AppThemeContext);

  return (
    <>
      <div className={`main-layout ${appTheme}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default UILayout;
