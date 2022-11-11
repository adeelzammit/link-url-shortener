import { useState } from "react";
import Cookies from "universal-cookie";
import uuid from "react-uuid";

// Hook
export const useSetClientCookie = (key: string = "anonUserUUID") => {
  // State to store our cookie
  // Pass initial state function to useState so logic is only executed once
  const [cookie, setCookies] = useState<Cookies>(() => {
    const cookies = new Cookies();
    const dateNow: Date = new Date();
    const dateYearFromNow: Date = new Date();
    dateYearFromNow.setDate(dateNow.getDate() + 365);
    if (!cookies.get(key)) {
      cookies.set("anonUserUUID", uuid(), {
        // Turning off for now:
        // expires: dateYearFromNow,
        path: "/",
      });
    }
    return cookies;
  });

  return [cookie, setCookies];
};
