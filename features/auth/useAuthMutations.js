import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup, logout } from "./authApi";

export function useLoginMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // save user in cache so you can read it anywhere
            qc.setQueryData(["me"], data.user);
        }
    })
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
    const qc = useQueryClient()

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            qc.removeQueries({ queryKey: ["me"] })
        }
    })
}