import { useQuery, useQueryClient } from "@tanstack/react-query";
import { meApi } from "./authApi";
import { bootstrapAuth } from "@/lib/apiClient";



export function useAuthUser() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: bootstrapAuth,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => data?.user ?? null,
  });
}

export function useSignupData() {
  const qc = useQueryClient();
  return qc.getQueryData(["signup-data"]);
}