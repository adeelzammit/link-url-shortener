import { useQuery } from "react-query";
import { apiRoutes } from "../apiRoutes";
import apiAxios from "../axios";

export const useGetCookie = () => {
  return useQuery({
    queryFn: () => {
      return apiAxios.get(apiRoutes.getCookie);
    },
  });
};
