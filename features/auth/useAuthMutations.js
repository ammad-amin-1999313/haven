import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup, logout } from "./authApi";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";

export function useLoginMutation() {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      //   tokenStore.set(data.accessToken);
      qc.setQueryData(["auth"], data); // 🔥 KEY LINE
      dispatch(setUser(data.user));
    },
  });
}


export function useSignupMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      qc.setQueryData(["signup-data"], data.user)
    }
  })
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      qc.setQueryData(["auth"], null);
      dispatch(clearUser())
      qc.removeQueries({ queryKey: ["auth"] });
    },
  });
}
