import { useMutation } from "react-query";
import { apiRoutes } from "../apiRoutes";
import apiAxios from "../axios";

export const usePostShortenLink = () => {
  return useMutation({
    mutationFn: (urlToShorten: any) =>
      apiAxios.post(apiRoutes.shorten, urlToShorten),
  });
};
