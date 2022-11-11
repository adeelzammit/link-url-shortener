import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { ThemeModeEnum } from "../../types/types";

export const theme = {
  [ThemeModeEnum.DARK]: {
    themeButtonLogo: faMoon,
    themeButtonText: "Click Switch to change to Light Mode",
  },
  [ThemeModeEnum.LIGHT]: {
    themeButtonLogo: faSun,
    themeButtonText: "Click Switch to change to Dark Mode",
  },
};
