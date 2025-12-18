import { useQuery } from "@tanstack/react-query";
import { meApi } from "./authApi";

export function useAuthUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: meApi,
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useSignupData() {
  const qc = useQueryClient();
  // We use getQueryData because we just want the value currently in cache
  return qc.getQueryData(["signup-data"]);
}