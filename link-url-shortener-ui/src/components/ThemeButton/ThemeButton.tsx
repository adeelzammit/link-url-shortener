import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { DEFAULT_DELAY } from "../../common/constants/constants";
import { theme } from "../../common/keys/theme/theme";
import { ThemeModeEnum } from "../../common/types/types";
import { AppThemeContext } from "../../context/AppThemeContext";
import "./ThemeButton.scss";

const ThemeButton = () => {
  const { toggleTheme, appTheme } = React.useContext(AppThemeContext);

  return (
    <div className="d-flex align-items-center justify-content-center theme-btn-ctr">
      <OverlayTrigger
        placement="bottom"
        delay={DEFAULT_DELAY}
        overlay={(props: any) => (
          <Tooltip {...props}>{theme[appTheme].themeButtonText}</Tooltip>
        )}
      >
        <FontAwesomeIcon icon={theme[appTheme].themeButtonLogo} />
      </OverlayTrigger>
      <Form.Check
        defaultChecked={appTheme === ThemeModeEnum.DARK}
        className={`theme-check-btn`}
        onClick={toggleTheme}
        type="switch"
      />
    </div>
  );
};
export default ThemeButton;
