"use client";

import { bootstrapAuth } from "@/lib/apiClient";
import { clearUser, setUser } from "@/store/userSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthBootstrap({ children }) {

  const dispatch = useDispatch();

  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: bootstrapAuth,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (authData?.user) {
      dispatch(setUser(authData.user));
    } else {
      dispatch(clearUser());
    }
  }, [authData]);
  if (isLoading) return null;

  return children;
}
