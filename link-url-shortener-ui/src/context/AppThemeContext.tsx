import React from "react";
import { LocalStorageKeys, ThemeModeEnum } from "../common/types/types";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AppThemeContext = React.createContext({
  appTheme: ThemeModeEnum.LIGHT,
  toggleTheme: () => {},
});

const AppThemeProvider = ({ children }: any) => {
  const [appTheme, setappTheme] = useLocalStorage(
    LocalStorageKeys.THEME,
    ThemeModeEnum.LIGHT
  );

  const toggleTheme = () => {
    appTheme === ThemeModeEnum.DARK
      ? setappTheme(ThemeModeEnum.LIGHT)
      : setappTheme(ThemeModeEnum.DARK);
  };

  return (
    <>
      <AppThemeContext.Provider value={{ appTheme, toggleTheme }}>
        {children}
      </AppThemeContext.Provider>
    </>
  );
};

export { AppThemeContext, AppThemeProvider };
