import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiRoutes } from "../apiRoutes";
import apiAxios from "../axios";

export const useGetUrlHistory = () => {
  return useQuery({
    queryKey: [apiRoutes.getHistory],
    queryFn: () => {
      return apiAxios.get(apiRoutes.getHistory);
    },
  });
};

export const useDeleteUrlHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiAxios.delete(apiRoutes.deleteHistory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.getHistory] });
    },
  });
};
