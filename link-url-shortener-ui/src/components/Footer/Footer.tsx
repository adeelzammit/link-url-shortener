import React from "react";
import { Alert, Button } from "react-bootstrap";
import { LocalStorageKeys, ThemeModeEnum } from "../../common/types/types";
import { AppThemeContext } from "../../context/AppThemeContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const Footer = () => {
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorage(
    LocalStorageKeys.COOKIES_ACCEPTED,
    false
  );
  const { appTheme } = React.useContext(AppThemeContext);

  const closeShowCookiesAlert = () => {
    setCookiesAccepted(true);
  };

  return (
    <footer>
      <Alert
        variant={appTheme}
        dismissible
        closeLabel="Got it!"
        show={!cookiesAccepted}
        onClose={closeShowCookiesAlert}
        className="m-0"
      >
        We use cookies to personalize and improve your experience on our site.
        Closing this means you agree to use the Use of Cookies 🍪
        <div className="d-flex justify-content-end">
          <Button
            onClick={closeShowCookiesAlert}
            variant={`${
              appTheme === ThemeModeEnum.DARK
                ? ThemeModeEnum.LIGHT
                : ThemeModeEnum.DARK
            }`}
          >
            Got it!
          </Button>
        </div>
      </Alert>
    </footer>
  );
};

export default Footer;
